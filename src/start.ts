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
const deck = cartesian(['C', 'H', 'S', 'D'], ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13'])

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
        players: [],
        player_bid_first: 0,
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
        db.set('shared.mode', 'predictions')
          .set('shared.cards_per_hand', 10)
          .set('shared.in_play', 0)
          .write()
        deal()
        break;
      case "submit_prediction":
        db.get('shared.predictions').push(message.value).write()
        all_players = db.get('shared.players').value()
        if (message.player_index == all_players.length - 1) {
          const predictions = db.get('shared.predictions').value()
          const highest_index = predictions.indexOf(Math.max(...predictions))
          db.set('shared.in_play', highest_index)
            .set('shared.mode', 'choose_trump')
            .write()
        }
        else {
          db.set('shared.in_play', message.player_index + 1).write()
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
          .set('shared.in_play', message.player_index + 1)
          .set(['shared', 'table', message.player_index], dealt_card[0]).write()
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