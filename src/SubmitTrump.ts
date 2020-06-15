import { IMessage, fetch_players, log, letterToSuit } from './utils';

export const SubmitTrump = (db: any, message: IMessage ): boolean => {
  const all_players = fetch_players(db)
  const player_bid_first = db.get('shared.player_bid_first').value()
  db.set('shared.trump_suit', message.value)
    .set('shared.player_lead_trick', player_bid_first)
    .set('shared.in_play', player_bid_first)
    .set('shared.mode', 'play')
    .set('shared.table', all_players.map(x => null))
    .set('shared.tricks_won', all_players.map(x => 0))
    .write()
  log(db, message, `set the trump suit to ${letterToSuit(message.value)}`)
  log(db, { name: all_players[player_bid_first] }, "is leading the first trick")
  return true;
}