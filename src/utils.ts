import _ from 'lodash';

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
  type: string,
  player_index: number,
  value?: string,
  user_id: string
}

export const generate_deck = (): string[] =>
  cartesian(['C', 'H', 'S', 'D'], ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14'])

export const deal = (deck: string[], db: any) => {
  let this_deck: string[] = _.shuffle(_.clone(deck))
  const cards_per_hand = db.get('shared.cards_per_hand').value()
  Object.keys(db.get('private').value()).forEach(user_id => {
    let this_hand = this_deck.splice(0, cards_per_hand)
    db.set(['private', user_id, 'hand'], this_hand.sort(sort_by_suit)).write()
  })
}

export const fetch_players = (db: any) => db.get('shared.players').value()

export const initialise = (db: any, message: IMessage) =>
  db.defaults({
    private: {},
    shared: {
      game_id: message.game_id,
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