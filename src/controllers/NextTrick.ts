import { fetch_players, log, ELogAction } from '../utils';

export const NextTrick = async (db: any): Promise<boolean> => {
  const all_players = fetch_players(db)
  const player_to_lead = db.get('shared.in_play').value()
  await db.set('shared.mode', 'play')
    .set('shared.player_lead_trick', player_to_lead)
    .set('shared.table', all_players.map(x => null))
    .write()
    await log(db, player_to_lead, ELogAction.LEADING_TRICK)
  return true;
}