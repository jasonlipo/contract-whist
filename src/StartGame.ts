import { deal, fetch_players } from './utils';

export const StartGame = (db: any, deck: string[]): boolean => {
  const all_players = fetch_players(db)
  db.set('shared.mode', 'predictions')
    .set('shared.player_bid_first', 0)
    .set('shared.cards_per_hand', 10)
    .set('shared.in_play', 0)
    .set('shared.predictions', all_players.map(x => null))
    .set('shared.points', all_players.map(x => 0))
    .write()
  deal(deck, db)
  return true;
}