import { deal, fetch_players, log, IMessage } from '../utils';

export const StartGame = async (db: any, message: IMessage, deck: string[]): Promise<boolean> => {
  const all_players = fetch_players(db)
  await db.set('shared.mode', 'bids')
    .set('shared.player_bid_first', 0)
    .set('shared.cards_per_hand', 10)
    .set('shared.in_play', 0)
    .set('shared.bids', all_players.map(x => null))
    .set('shared.points', all_players.map(x => 0))
    .write()
  deal(deck, db)
  await log(db, message, "started the round with 10 cards and is first to bid")
  return true;
}