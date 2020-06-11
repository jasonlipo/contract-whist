import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';

interface IScoresProps extends IContractWhistState {
  onNextRound(): void
}

export const Scores: FC<IScoresProps> = ({ admin, predictions, tricks_won, points, cards_per_hand, onNextRound, players, cards_decreasing, name }) => {
  const calculate_score = (prediction: number, tricks: number) => {
    if (prediction == tricks) {
      if (prediction == 0) {
        let sum_of_predictions = _.sum(predictions)
        let rounding
        if (sum_of_predictions > cards_per_hand) {
          rounding = Math.floor(cards_per_hand / 2)
        }
        else {
          rounding = Math.ceil(cards_per_hand / 2)
        }
        return rounding
      }
      return cards_per_hand + prediction
    }
    else {
      return Math.abs(prediction - tricks) * -1
    }
  }

  const player_point_join = points.map((p, i) => ({ points: p, name: players[i] }))
  const sorted_leaderboard = player_point_join.sort((a, b) => b.points - a.points)

  return (
    <>
      <div className="scores">
        <div className="deltas">
          <div className="score-title">This Round</div>
          {
            players.map((name, index) => {
              let prediction = predictions[index]
              let tricks = tricks_won[index]
              let this_round = calculate_score(prediction, tricks)
              return (
                <div className="score-row">
                  <div className="score-row-name">{name}</div>
                  <div className={"score-row-points " + (this_round < 0 && "negative")}>{this_round > 0 && "+"}{this_round}</div>
                </div>
              )
            })
          }
        </div>
        <div className="leaderboard">
          <div className="score-title">Leaderboard</div>
          {
            sorted_leaderboard.map(({ points, name }) =>
              <div className="score-row">
                <div className="score-row-name">{name}</div>
                <div className="score-row-points">{points}</div>
              </div>
            )
          }
        </div>
      </div>
      {
        (cards_per_hand == 10 && !cards_decreasing) ?
        <div className="game_over actions">
          The game is over!<br /><br />
          {
            sorted_leaderboard[0].name == name ?
            <b>Congratulations! You won the game!</b> :
            <b>Congratulations to {sorted_leaderboard[0].name} for winning the game.</b>
          }
        </div>
        :
        (
          admin ?
          <div className="next_round actions">
            The scores are in! Click the button below to deal the next round.<br /><br />
            <button onClick={() => onNextRound()}>Next Round</button>
          </div>
          : <></>
        )
      }
    </>
  )
}