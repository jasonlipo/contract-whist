import _ from 'lodash';
import { log, fetch_players } from './utils';

export const GetScores = (db: any): boolean => {

  let all_players = fetch_players(db)
  let new_points = db.get('shared.points').value()
  let bids = db.get('shared.bids').value()
  let tricks_won = db.get('shared.tricks_won').value()
  let cards_per_hand = db.get('shared.cards_per_hand').value()
  let deltas: { name: string, value: number }[] = []
  let leaderboard: { name: string, value: number }[] = []

  const store_scores = (player_index: number, current: number, delta: number) => {
    deltas.push({ name: all_players[player_index], value: delta })
    leaderboard.push({ name: all_players[player_index], value: current + delta })
    db.get(['shared', 'points_history', all_players[player_index]]).push(current + delta).write()
    return current + delta
  }

  new_points = new_points.map((current_points, player_index) => {
    let bid = bids[player_index]
    let tricks = tricks_won[player_index]
    if (bid == tricks) {
      if (bid == 0) {
        let sum_of_bids = _.sum(bids)
        if (sum_of_bids > cards_per_hand) {
          return store_scores(player_index, current_points, Math.floor(cards_per_hand / 2))
        }
        else {
          return store_scores(player_index, current_points, Math.ceil(cards_per_hand / 2))
        }
      }
      return store_scores(player_index, current_points, cards_per_hand + bid)
    }
    else {
      return store_scores(player_index, current_points, -1 * Math.abs(bid - tricks))
    }
  })

  leaderboard = leaderboard.sort((a, b) => b.value - a.value)

  db.set('shared.mode', 'scores')
    .set('shared.points', new_points)
    .set('shared.table', [])
    .set('shared.in_play', null)
    .write()
  log(db, { name: "The round is over. "}, "Here are the scores")

  const scores_log = `
  <div class="scores">
    <div class="deltas">
      <div class="score-title">This Round</div>
      ${
        deltas.map(({ name, value }) =>
          `
          <div class="score-row">
            <div class="score-row-name">${name}</div>
            <div class="score-row-points ${value < 0 ? "negative": ""}">${value}</div>
          </div>
          `
        ).join("")
      }
    </div>
    <div class="leaderboard">
      <div class="score-title">Leaderboard</div>
      ${
        leaderboard.map(({ name, value }) =>
          `
          <div class="score-row">
            <div class="score-row-name">${name}</div>
            <div class="score-row-points">${value}</div>
          </div>
          `
        ).join("")
      }
    </div>
  </div>
  `
  log(db, { name: "" }, scores_log)
  return true;
}