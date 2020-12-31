import { deal, IMessage, fetch_players, log, ELogAction } from '../utils';

export const SubmitBid = async (db: any, message: IMessage, deck: string[]): Promise<boolean> => {
  await db.set(['shared', 'bids', message.player_index], message.value).write()
  await log(db, message.player_index, ELogAction.MADE_BID, message.value)
  const all_players = fetch_players(db)
  if (db.get('shared.bids').value().filter(x => x == null).length == 0) {
    // Special case: check for all 0 bids
    if (db.get('shared.bids').value().filter(x => x == 0).length == all_players.length) {
      // Re-deal
      await db.set('shared.in_play', db.get('shared.player_bid_first').value())
        .set('shared.bids', all_players.map(x => null))
        .write()
      await deal(deck, db)
      await log(db, message.player_index, ELogAction.BID_ZERO_REDEAL)
    }
    else {
      const bids = db.get('shared.bids').value()
      // Decide who chooses trump suit
      const max_bid = Math.max(...bids)
      let count_bids = 0
      let highest_index = db.get('shared.player_bid_first').value()
      while (count_bids < all_players.length) {
        if (bids[highest_index] == max_bid) {
          break;
        }
        highest_index++;
        highest_index %= all_players.length;
        count_bids++;
      }
      await db.set('shared.in_play', highest_index)
        .set('shared.mode', 'choose_trump')
        .write()
        await log(db, highest_index, ELogAction.CHOOSING_TRUMP)
    }
  }
  else {
    const next_person_to_bid = (message.player_index + 1) % all_players.length
    await db.set('shared.in_play', next_person_to_bid).write()
    await log(db, next_person_to_bid, ELogAction.NEXT_TO_BID)
  }
  return true;
}
