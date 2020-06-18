import { deal, IMessage, fetch_players, log } from './utils';

export const SubmitBid = (db: any, message: IMessage, deck: string[]): boolean => {
  db.set(['shared', 'bids', message.player_index], message.value).write()
  log(db, message, `made a bid of ${message.value}`)
  const all_players = fetch_players(db)
  if (db.get('shared.bids').value().filter(x => x == null).length == 0) {
    // Special case: check for all 0 bids
    if (db.get('shared.bids').value().filter(x => x == 0).length == all_players.length) {
      // Re-deal
      db.set('shared.in_play', db.get('shared.player_bid_first').value())
        .set('shared.bids', all_players.map(x => null))
        .write()
      deal(deck, db)
      log(db, message, `'s bid of 0 means the cards are re-dealt`)
    }
    else {
      const bids = db.get('shared.bids').value()
      const highest_index = bids.indexOf(Math.max(...bids))
      db.set('shared.in_play', highest_index)
        .set('shared.mode', 'choose_trump')
        .write()
    }
  }
  else {
    db.set('shared.in_play', (message.player_index + 1) % all_players.length).write()
  }
  return true;
}