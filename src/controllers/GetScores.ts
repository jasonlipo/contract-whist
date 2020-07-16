import _ from 'lodash';
import { log, fetch_players, ELogAction } from '../utils';

export const GetScores = async (db: any): Promise<boolean> => {

  let all_players = fetch_players(db)
  let new_points = db.get('shared.points').value()
  let bids = db.get('shared.bids').value()
  let tricks_won = db.get('shared.tricks_won').value()
  let cards_per_hand = db.get('shared.cards_per_hand').value()
  const points_history_index = db.get('shared.points_history').value().length

  await db.get('shared.points_history').push(all_players.map(_x => 0)).write()

  const store_scores = async (player_index: number, current: number, delta: number) => {
    if (db.get('shared.trump_suit').value() == "no_trump" && db.get('shared.double_points_no_trumps').value()) {
      delta *= 2
    }
    await db.set(['shared', 'points_history', points_history_index, player_index], delta).write()
    return current + delta
  }

  new_points = new_points.map(async (current_points, player_index) => {
    let bid = bids[player_index]
    let tricks = tricks_won[player_index]
    if (bid == tricks) {
      if (bid == 0) {
        let sum_of_bids = _.sum(bids)
        if (db.get('shared.scoring_method').value() == "fixed") {
          cards_per_hand = 10
        }
        if (sum_of_bids > cards_per_hand) {
          return await store_scores(player_index, current_points, Math.floor(cards_per_hand / 2))
        }
        else {
          return await store_scores(player_index, current_points, Math.ceil(cards_per_hand / 2))
        }
      }
      return await store_scores(player_index, current_points, cards_per_hand + bid)
    }
    else {
      return await store_scores(player_index, current_points, -1 * Math.abs(bid - tricks))
    }
  })

  new_points = await Promise.all(new_points)

  await db.set('shared.mode', 'scores')
    .set('shared.points', new_points)
    .set('shared.table', [])
    .set('shared.in_play', null)
    .write()
  await log(db, -1, ELogAction.PRINT_SCORES, points_history_index.toString())
  return true;
}