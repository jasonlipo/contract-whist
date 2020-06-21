import React, { useMemo, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import { Chart } from 'react-charts'

interface IScoresProps extends IContractWhistState {
  onNextRound(): void
}

export const Scores: FC<IScoresProps> = ({ admin, points, cards_per_hand, onNextRound, players, cards_decreasing, name, points_history }) => {
  const player_point_join = points.map((p, i) => ({ points: p, name: players[i] }))
  const sorted_leaderboard = player_point_join.sort((a, b) => b.points - a.points)


  const data = useMemo(() => Object.keys(points_history).map(p => ({ label: p, data: points_history[p].map((y, x) => [x + 1, y]) })), [])
  const series = useMemo(() => ({ showPoints: true }), [])
  const axes = useMemo(() => [{ primary: true, type: 'linear', position: 'bottom', show: false, hardMin: 1 }, { type: 'linear', position: 'left' }], [])

  return (
    <div className="graph">
      <div style={{height: 200, width: 210, marginLeft: 10, marginBottom: 15, boxSizing: 'border-box'}}>
        <Chart data={data} series={series} axes={axes} tooltip dark />
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
    </div>
  )
}