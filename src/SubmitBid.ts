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
      log(db, { name: all_players[highest_index] }, `is choosing the trump suit`)
    }
  }
  else {
    const next_person_to_bid = (message.player_index + 1) % all_players.length
    db.set('shared.in_play', next_person_to_bid).write()
    log(db, { name: all_players[next_person_to_bid] }, `is next to bid`)
  }
  return true;
}