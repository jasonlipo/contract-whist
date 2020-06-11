const WebSocketServer = require('websocket').server;
const _ = require('lodash')
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
var http = require('http')
const fs = require('fs')
const clients = {}

interface Message {
  game_id: string,
  type: string,
  player_index: number,
  value?: string,
  user_id: string
}

const express = require('express')
const app = express()
app.use('/', express.static(path.join(__dirname, 'react')))
const server = app.listen(process.env.PORT || 3000)

const cartesian = (a, b) => [].concat(...a.map(c => (b.map(d => c.concat(d)))));
const deck = cartesian(['C', 'H', 'S', 'D'], ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'])

const sort_by_suit = (a, b) => {
  let a_suit = a.substr(0, 1)
  let b_suit = b.substr(0, 1)
  let a_val = a.substr(1)
  let b_val = b.substr(1)
  if (a_suit == b_suit) return parseInt(a_val) - parseInt(b_val)
  return a_suit > b_suit ? 1 : -1
}

const wss = new WebSocketServer({ httpServer: server });
wss.on('request', ws => {
  const connection = ws.accept(null, ws.origin);
  connection.on('message', raw => {
    let message: Message = JSON.parse(raw.utf8Data)
    let adapter = new FileSync('data/' + message.game_id + '.json')
    let db = low(adapter)

    const deal = () => {
      let this_deck: string[] = _.shuffle(_.clone(deck))
      const cards_per_hand = db.get('shared.cards_per_hand').value()
      Object.keys(db.get('private').value()).forEach(user_id => {
        let this_hand = this_deck.splice(0, cards_per_hand)
        db.set(['private', user_id, 'hand'], this_hand.sort(sort_by_suit)).write()
      })
    }

    db.defaults({
      private: {},
      shared: {
        points: [],
        players: [],
        cards_decreasing: true,
        player_bid_first: null,
        predictions: [],
        mode: 'players_joining',
        trump_suit: null,
        table: [],
        tricks_won: [],
        player_lead_trick: null
      }
    }).write()

    clients[message.user_id] = connection
    let all_players;

    switch (message.type) {
      case "new_player":
        let players = db.get('shared.players')
        let admin_player = players.size() == 0
        players.push(message.value).write()
        db.set(['private', message.user_id], {
          player_index: players.size() - 1,
          user_id: message.user_id,
          name: message.value,
          admin: admin_player
        }).write()
        break;
      case "start_game":
        all_players = db.get('shared.players').value()
        db.set('shared.mode', 'predictions')
          .set('shared.player_bid_first', 0)
          .set('shared.cards_per_hand', 10)
          .set('shared.in_play', 0)
          .set('shared.predictions', all_players.map(x => null))
          .set('shared.points', all_players.map(x => 0))
          .write()
        deal()
        break;
      case "submit_prediction":
        db.set(['shared', 'predictions', message.player_index], message.value).write()
        all_players = db.get('shared.players').value()
        if (db.get('shared.predictions').value().filter(x => x == null).length == 0) {
          // Special case: check for all 0 predictions
          if (db.get('shared.predictions').value().filter(x => x == 0).length == all_players.length) {
            // Re-deal
            db.set('shared.in_play', db.get('shared.player_bid_first').value())
              .set('shared.predictions', all_players.map(x => null))
              .write()
            deal()
          }
          else {
            const predictions = db.get('shared.predictions').value()
            const highest_index = predictions.indexOf(Math.max(...predictions))
            db.set('shared.in_play', highest_index)
              .set('shared.mode', 'choose_trump')
              .write()
          }
        }
        else {
          db.set('shared.in_play', (message.player_index + 1) % all_players.length).write()
        }
        break;
      case "submit_trump":
        all_players = db.get('shared.players').value()
        db.set('shared.trump_suit', message.value)
          .set('shared.player_lead_trick', db.get('shared.player_bid_first').value())
          .set('shared.in_play', db.get('shared.player_bid_first').value())
          .set('shared.mode', 'play')
          .set('shared.table', all_players.map(x => null))
          .set('shared.tricks_won', all_players.map(x => 0))
          .write()
        break;
      case "play_card":
        let new_hand = db.get(['private', message.user_id, 'hand']).value()
        let dealt_card = new_hand.splice(message.value, 1)
        db.set(['private', message.user_id, 'hand'], new_hand)
          .set('shared.in_play', (message.player_index + 1) % db.get('shared.players').size())
          .set(['shared', 'table', message.player_index], dealt_card[0]).write()

        if (db.get('shared.table').value().filter(x => x == null).length == 0) {
          // End of trick
          db.set('shared.mode', 'end_of_trick').write()
          const table = db.get('shared.table').value()
          const trump_suit = db.get('shared.trump_suit').value()
          if (trump_suit != "no_trump") {
            const find_trump = table.filter(card => card.substr(0, 1) == trump_suit)
            if (find_trump.length > 0) {
              const winning_card = _.max(find_trump.map(card => parseInt(card.substr(1))))
              const winning_player_index = table.indexOf(trump_suit + winning_card.toString())
              const new_trick_wins = db.get(['shared', 'tricks_won', winning_player_index]).value() + 1
              db.set('shared.in_play', winning_player_index)
                .set(['shared', 'tricks_won', winning_player_index], new_trick_wins)
                .write()
              break;
            }
          }
          const leading_suit = table[db.get('shared.player_lead_trick').value()].substr(0, 1)
          const find_leading_suit = table.filter(card => card.substr(0, 1) == leading_suit)
          const winning_card = _.max(find_leading_suit.map(card => parseInt(card.substr(1))))
          const winning_player_index = table.indexOf(leading_suit + winning_card.toString())
          const new_trick_wins = db.get(['shared', 'tricks_won', winning_player_index]).value() + 1
          db.set('shared.in_play', winning_player_index)
            .set(['shared', 'tricks_won', winning_player_index], new_trick_wins)
            .write()
        }
        break;
      case "next_trick":
        all_players = db.get('shared.players').value()
        db.set('shared.mode', 'play')
          .set('shared.player_lead_trick', db.get('shared.in_play').value())
          .set('shared.table', all_players.map(x => null))
          .write()
        break;
      case "get_scores":
        let new_points = db.get('shared.points').value()
        let predictions = db.get('shared.predictions').value()
        let tricks_won = db.get('shared.tricks_won').value()
        let cards_per_hand = db.get('shared.cards_per_hand').value()
        new_points = new_points.map((current_points, player_index) => {
          let prediction = predictions[player_index]
          let tricks = tricks_won[player_index]
          if (prediction == tricks) {
            if (prediction == 0) {
              let sum_of_predictions = _.sum(predictions)
              let rounding
              if (sum_of_predictions > cards_per_hand) {
                rounding = Math.floor(cards_per_hand / 2)
              }
              else {
                rounding = Math.ceil(cards_per_hand / 2)
              }
              return current_points + rounding
            }
            return current_points + cards_per_hand + prediction
          }
          else {
            return current_points - Math.abs(prediction - tricks)
          }
        })
        db.set('shared.mode', 'scores')
          .set('shared.points', new_points)
          .set('shared.table', [])
          .set('shared.in_play', null)
          .write()
        break;
      case "next_round":
        all_players = db.get('shared.players').value()
        const new_first_bidder = (db.get('shared.player_bid_first').value() + 1) % all_players.length
        let new_cards_step = 1
        if (db.get('shared.cards_decreasing').value()) {
          new_cards_step = -1
          if (db.get('shared.cards_per_hand') == 3) {
            // 2 is the minimum cards before we go back up again
            db.set('shared.cards_decreasing', false).write()
          }
        }
        db.set('shared.mode', 'predictions')
          .set('shared.player_lead_trick', null)
          .set('shared.tricks_won', [])
          .set('shared.trump_suit', null)
          .set('shared.player_bid_first', new_first_bidder)
          .set('shared.in_play', new_first_bidder)
          .set('shared.predictions', all_players.map(x => null))
          .set('shared.cards_per_hand', db.get('shared.cards_per_hand') + new_cards_step)
          .write()
        deal()
        break;
    }

    Object.keys(db.get('private').value())
      .filter(user_id => user_id in clients)
      .forEach(user_id => {
        let client = clients[user_id]
        if (client) {
          const response = { ...db.get(['private', user_id]).value(), ...db.get('shared').value() }
          client.sendUTF(JSON.stringify(response));
        }
      });
  });
});