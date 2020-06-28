import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import { Card } from './Card';

interface ICardTableProps extends IContractWhistState {
  onSwitchEditName: (value: boolean) => void
}

export const CardTable: FC<ICardTableProps> = ({ player_index, in_play, name, players, table, bids, tricks_won, onSwitchEditName, editing_name, send }) => {
  const [newName, setNewName] = useState<string>(name)

  const rotate = (array: any[]) => {
    let copy = _.clone(array)
    return copy.concat(copy.splice(0, player_index))
  }

  let rotated_in_play = in_play == null ? -1 : ((in_play - player_index) + players.length) % players.length
  let rotated_players = rotate(players)
  let rotated_table = rotate(table)
  let rotated_tricks_won = rotate(tricks_won)
  let rotated_bids = rotate(bids)

  return (
    <>
      <div className="gap"></div>
      <div className="black_square"></div>
      <div className="gap"></div>
      <div className="my_area">
        <div className={"player_name "+(rotated_in_play == 0 ? "in_play" : "")}>
          {
            editing_name ?
            <form onSubmit={e => { e.preventDefault(); onSwitchEditName(false); send({ type: "change_name", value: newName }); return false;}}>
              <input value={newName} onChange={e => setNewName(e.target.value)} className="edit-input" type="text" />
              <label>
                <input type="submit" style={{ display: "none" }} />
                <svg className="save-edit" viewBox="0 0 515.556 515.556">
                  <path d="m0 274.226 176.549 176.886 339.007-338.672-48.67-47.997-290.337 290-128.553-128.552z"/>
                </svg>
              </label>
            </form>
            :
            <>
              {name} (You)
              <svg className="edit" viewBox="0 0 528.899 528.899" onClick={() => onSwitchEditName(true)}>
                <g>
                  <path d="M328.883,89.125l107.59,107.589l-272.34,272.34L56.604,361.465L328.883,89.125z M518.113,63.177l-47.981-47.981   c-18.543-18.543-48.653-18.543-67.259,0l-45.961,45.961l107.59,107.59l53.611-53.611   C532.495,100.753,532.495,77.559,518.113,63.177z M0.3,512.69c-1.958,8.812,5.998,16.708,14.811,14.565l119.891-29.069   L27.473,390.597L0.3,512.69z"/>
                </g>
              </svg>
            </>
          }
          <div className="bid_tricks">
            {tricks_won[player_index] == null ? "-" : tricks_won[player_index]} / {bids[player_index] == null ? "-" : bids[player_index]} tricks won
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
                  <div className="bid_tricks">
                    {rotated_tricks_won[i] == null ? "-" : rotated_tricks_won[i]} / {rotated_bids[i] == null ? "-" : rotated_bids[i]} tricks won
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