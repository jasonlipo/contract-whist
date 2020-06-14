import { deal, fetch_players } from './utils';

export const NextRound = (db: any, deck: string[]): boolean => {
  const all_players = fetch_players(db)
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
  deal(deck, db)
  return true;
}