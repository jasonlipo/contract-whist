import { deal, IMessage, fetch_players } from './utils';

export const SubmitPrediction = (db: any, message: IMessage, deck: string[]): boolean => {
  db.set(['shared', 'predictions', message.player_index], message.value).write()
  const all_players = fetch_players(db)
  if (db.get('shared.predictions').value().filter(x => x == null).length == 0) {
    // Special case: check for all 0 predictions
    if (db.get('shared.predictions').value().filter(x => x == 0).length == all_players.length) {
      // Re-deal
      db.set('shared.in_play', db.get('shared.player_bid_first').value())
        .set('shared.predictions', all_players.map(x => null))
        .write()
      deal(deck, db)
    }
    else {
      const predictions = db.get('shared.predictions').value()
      const highest_index = predictions.indexOf(Math.max(...predictions))
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