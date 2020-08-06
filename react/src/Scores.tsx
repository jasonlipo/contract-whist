import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import Chart from "react-apexcharts";
import { CountdownTimer } from './CountdownTimer';

interface IScoresProps extends IContractWhistState {
  onNextRound(): void
}

export const print_scores_log = (index: number, players: string[], points_history: number[][]) => {
  const deltas = points_history[index]
  const leaderboard = players.map((_p, i) => points_history.slice(0, index + 1).map(history => history[i])).map(scores => _.sum(scores))
  return (
    <div className="scores">
      <div className="deltas">
        <div className="score-title">This Round</div>
        {
          deltas.map((v, i) =>
            <div key={i} className="score-row">
              <div className="score-row-name">{players[i]}</div>
              <div className={`score-row-points ${v < 0 ? "negative": ""}`}>{v}</div>
            </div>
          )
        }
      </div>
      <div className="leaderboard">
        <div className="score-title">Leaderboard</div>
        {
          _.orderBy(leaderboard.map((v, i) => ({ player: players[i], score: v })), ['score'], ['desc']).map(({ player, score }, i) =>
            <div key={i} className="score-row">
              <div className="score-row-name">{player}</div>
              <div className="score-row-points">{score}</div>
            </div>
          )
        }
      </div>
    </div>
  )
}

export const Scores: FC<IScoresProps> = ({ admin, points, cards_per_hand, onNextRound, players, cards_decreasing, name, points_history, timer_seconds, enable_timer }) => {
  const player_point_join = points.map((p, i) => ({ points: p, name: players[i] }))
  const sorted_leaderboard = player_point_join.sort((a, b) => b.points - a.points)

  const data = players.map((player, i) => ({ name: player, data: points_history.map(history => history[i]) }))
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
      categories: points_history.map((_x, i) => i + 1),
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
              {
                (enable_timer && timer_seconds !== null) &&
                <CountdownTimer seconds={timer_seconds} onComplete={() => onNextRound()} />
              }
            </div>
            : <></>
          )
      }
    </div>
  )
}