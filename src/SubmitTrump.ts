import { IMessage, fetch_players } from './utils';

export const SubmitTrump = (db: any, message: IMessage ): boolean => {
  const all_players = fetch_players(db)
  db.set('shared.trump_suit', message.value)
    .set('shared.player_lead_trick', db.get('shared.player_bid_first').value())
    .set('shared.in_play', db.get('shared.player_bid_first').value())
    .set('shared.mode', 'play')
    .set('shared.table', all_players.map(x => null))
    .set('shared.tricks_won', all_players.map(x => 0))
    .write()
  return true;
}