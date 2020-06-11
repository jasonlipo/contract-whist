import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import { Card } from './Card';

interface ICardTableProps extends IContractWhistState {
}

export const CardTable: FC<ICardTableProps> = ({ player_index, in_play, name, players, table, predictions, tricks_won }) => {
  const rotate = (array: any[]) => {
    let copy = _.clone(array)
    return copy.concat(copy.splice(0, player_index))
  }

  let rotated_in_play = in_play == null ? -1 : ((in_play - player_index) + players.length) % players.length
  let rotated_players = rotate(players)
  let rotated_table = rotate(table)
  let rotated_tricks_won = rotate(tricks_won)
  let rotated_predictions = rotate(predictions)

  return (
    <>
      <div className="black_square"></div>
      <div className="my_area">
        <div className={"player_name "+(rotated_in_play == 0 ? "in_play" : "")}>
          {name} (You)
          <div className="prediction_tricks">
            {tricks_won[player_index] == null ? "-" : tricks_won[player_index]} / {predictions[player_index] == null ? "-" : predictions[player_index]} tricks won
          </div>
        </div>
        <div className="player_card_in_play">
          {
            rotated_table[0] != null ?
            <Card id={rotated_table[0]} />
            : <div className="card_placeholder"></div>
          }
        </div>
      </div>
      <div className={"player_arrangement players_"+players.length}>
        {
          rotated_players.map((player_name: string, i: number) => {
            if (i == 0) return;
            return (
              <div key={i} className="player_area">
                <div className={"player_name "+(rotated_in_play == i ? "in_play" : "")}>
                  {player_name}
                  <div className="prediction_tricks">
                    {rotated_tricks_won[i] == null ? "-" : rotated_tricks_won[i]} / {rotated_predictions[i] == null ? "-" : rotated_predictions[i]} tricks won
                  </div>
                </div>
                <div className="player_card_in_play">
                  {
                    rotated_table[i] != null ?
                    <Card id={rotated_table[i]} />
                    : <div className="card_placeholder"></div>
                  }
                </div>
              </div>
            )
          })
        }
      </div>
    </>
  )
}