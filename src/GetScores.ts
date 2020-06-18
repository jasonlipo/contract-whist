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
  new_points = new_points.map((current_points, player_index) => {
    let bid = bids[player_index]
    let tricks = tricks_won[player_index]
    let this_delta = 0
    if (bid == tricks) {
      if (bid == 0) {
        let sum_of_bids = _.sum(bids)
        let rounding
        if (sum_of_bids > cards_per_hand) {
          rounding = Math.floor(cards_per_hand / 2)
        }
        else {
          rounding = Math.ceil(cards_per_hand / 2)
        }
        this_delta = rounding
        deltas.push({ name: all_players[player_index], value: this_delta })
        leaderboard.push({ name: all_players[player_index], value: current_points + this_delta })
        return current_points + this_delta
      }
      this_delta = cards_per_hand + bid
      deltas.push({ name: all_players[player_index], value: this_delta })
      leaderboard.push({ name: all_players[player_index], value: current_points + this_delta })
      return current_points + this_delta
    }
    else {
      this_delta = -1 * Math.abs(bid - tricks)
      deltas.push({ name: all_players[player_index], value: this_delta })
      leaderboard.push({ name: all_players[player_index], value: current_points + this_delta })
      return current_points + this_delta
    }
  })
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