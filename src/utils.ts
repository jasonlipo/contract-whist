import _ from 'lodash';
import moment from 'moment';
import { PostgresAsync } from './database'
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')

const cartesian = (a, b) => [].concat(...a.map(c => (b.map(d => c.concat(d)))));

const sort_by_suit = (a, b) => {
  let a_suit = a.substr(0, 1)
  let b_suit = b.substr(0, 1)
  let a_val = a.substr(1)
  let b_val = b.substr(1)
  if (a_suit == b_suit) return parseInt(a_val) - parseInt(b_val)
  return a_suit > b_suit ? 1 : -1
}

export interface IMessage {
  game_id: string,
  name: string,
  type: string,
  player_index: number,
  value: string,
  user_id: string,
  card_id?: string
}

export const generate_deck = (): string[] =>
  cartesian(['C', 'H', 'S', 'D'], ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'])

export const deal = async (deck: string[], db: any) => {
  let this_deck: string[] = _.shuffle(_.clone(deck))
  const cards_per_hand = db.get('shared.cards_per_hand').value()
  const promises = Object.keys(db.get('private').value()).map(async (user_id) => {
    let this_hand = this_deck.splice(0, cards_per_hand)
    await db.set(['private', user_id, 'hand'], this_hand.sort(sort_by_suit)).write()
  })
  await Promise.all(promises);
}

export const fetch_players = (db: any) => db.get('shared.players').value()

export const initialise = async (db: any, message: IMessage) =>
  db.defaults({
    private: {},
    shared: {
      log: [],
      game_id: message.game_id,
      points: [],
      points_history: [],
      players: [],
      cards_decreasing: true,
      player_bid_first: null,
      bids: [],
      mode: 'players_joining',
      trump_suit: null,
      table: [],
      tricks_won: [],
      player_lead_trick: null,
      timer_seconds: 30,
      enable_timer: true,
      scoring_method: 'variable',
      show_other_bids: true,
      show_other_tricks_won: true,
      double_points_no_trumps: false
    }
  }).write()

export const log = async (db: any, player: number, action: ELogAction, data?: string) => {
  let entry: any[] = [
    moment().unix(),
    player,
    action
  ]
  if (data) {
    entry.push(data)
  }
  return db.get('shared.log').push(entry).write()
}

export const letterToSuit = (trump: string = "") => {
  const map = {"C": "Clubs", "H": "Hearts", "D": "Diamonds", "S": "Spades", "no_trump": "No trumps"}
  return map[trump] || "N/A"
}

export const generate_db = async (id: string) => {
  let adapter
  if (process.env.NODE_ENV == "development") {
    adapter = new FileAsync("data/" + id + ".json")
  }
  else {
    adapter = new PostgresAsync(id)
  }
  return low(adapter)
}

export enum ELogAction {
  CREATE_GAME,
  JOIN_GAME,
  RENAME_PLAYER,
  PRINT_SCORES,
  START_FIRST_ROUND,
  START_ROUND,
  FIRST_BIDDER,
  NEXT_TO_BID,
  MADE_BID,
  BID_ZERO_REDEAL,
  CHOOSING_TRUMP,
  CHOSEN_TRUMP,
  LEADING_FIRST_TRICK,
  LEADING_TRICK,
  WON_TRICK,
  CHANGE_SETTINGS
}
