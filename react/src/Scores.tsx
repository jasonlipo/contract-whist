import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import Chart from "react-apexcharts";

interface IScoresProps extends IContractWhistState {
  onNextRound(): void
}

export const Scores: FC<IScoresProps> = ({ admin, points, cards_per_hand, onNextRound, players, cards_decreasing, name, points_history }) => {
  const player_point_join = points.map((p, i) => ({ points: p, name: players[i] }))
  const sorted_leaderboard = player_point_join.sort((a, b) => b.points - a.points)

  const data = Object.keys(points_history).map(p => ({ name: p, data: points_history[p] }))
  const options = {
    chart: {
      height: 200,
      type: 'line',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    stroke: { curve: 'smooth', width: 2 },
    grid: { yaxis: { lines: { show: false } } },
    markers: { size: 0 },
    xaxis: {
      categories: points_history[players[0]].map((_x, i) => i + 1),
      labels: {
        style: {
          colors: 'white'
        }
      }
    },
    yaxis: { labels: { style: { colors: 'white' } } },
    legend: { show: true, labels: { colors: 'white' } }
  }

  return (
    <div className="graph">
      <div style={{height: 200, width: 210, marginLeft: 10, marginBottom: 15, boxSizing: 'border-box'}}>
        <Chart
          options={options}
          series={data}
          type="line"
          height={200}
        />
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