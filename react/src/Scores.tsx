import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';

interface IScoresProps extends IContractWhistState {
  onNextRound(): void
}

export const Scores: FC<IScoresProps> = ({ admin, points, cards_per_hand, onNextRound, players, cards_decreasing, name }) => {
  const player_point_join = points.map((p, i) => ({ points: p, name: players[i] }))
  const sorted_leaderboard = player_point_join.sort((a, b) => b.points - a.points)

  return (
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
  )
}