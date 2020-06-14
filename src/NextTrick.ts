import { fetch_players } from './utils';

export const NextTrick = (db: any): boolean => {
  const all_players = fetch_players(db)
  db.set('shared.mode', 'play')
    .set('shared.player_lead_trick', db.get('shared.in_play').value())
    .set('shared.table', all_players.map(x => null))
    .write()
  return true;
}