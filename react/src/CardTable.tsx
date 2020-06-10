import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import { PlayingCard } from '@karlandin/playing-cards';
import { findCardById } from './HandOfCards';

interface ICardTableProps extends IContractWhistState {
}

export const CardTable: FC<ICardTableProps> = ({ player_index, in_play, name, players, table }) => {
  let players_copy = _.clone(players)
  let table_copy = _.clone(table)
  let player_order = players_copy.concat(players_copy.splice(0, player_index))
  let table_order = table_copy.concat(table_copy.splice(0, player_index))
  let in_play_shifted = ((in_play - player_index) + players.length) % players.length
  return (
    <>
      <div className="black_square"></div>
      <div className="my_area">
        <div className={"player_name "+(in_play_shifted == 0 ? "in_play" : "")}>{name} (You)</div>
        <div className="player_card_in_play">
          {
            table_order[0] != null ?
            <PlayingCard card={findCardById(table_order[0])} size="fill" />
            : <div className="card_placeholder"></div>
          }
        </div>
      </div>
      <div className={"player_arrangement players_"+players.length}>
        {
          player_order.map((player_name: string, i: number) => {
            if (i == 0) return;
            return (
              <div key={i} className="player_area">
                <div className={"player_name "+(in_play_shifted == i ? "in_play" : "")}>{player_name}</div>
                <div className="player_card_in_play">
                  {
                    table_order[i] != null ?
                    <PlayingCard card={findCardById(table_order[i])} size="fill" />
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