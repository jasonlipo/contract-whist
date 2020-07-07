import React, { FC } from 'react';
import { HandOfCards } from './HandOfCards';
import { IContractWhistState } from './ContractWhist';
import { CardTable } from './CardTable';

interface IGamePlayProps extends IContractWhistState {
  onSwitchEditName: (value: boolean) => void
}

export const GamePlay: FC<IGamePlayProps> = (props) => {
  const { mode, send } = props
  return (
    <div className="game_play">
      <div className="table">
        <CardTable {...props} />
      </div>
      <div className="control_panel">
        {
          (mode != 'scores' && mode != 'players_joining') &&
            <HandOfCards
              {...props}
              onClick={(i, id) => send({ type: "play_card", value: i, card_id: id })}
            />
        }
      </div>
    </div>
  )
}