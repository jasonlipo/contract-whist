import React, { FC } from 'react';
import { HandOfCards } from './HandOfCards';
import { IContractWhistState } from './ContractWhist';
import { Predictions } from './Predictions';

interface IGamePlayProps extends IContractWhistState {
  onStart(): void
}

export const GamePlay: FC<IGamePlayProps> = (props) => {
  const { mode, hand, admin, onStart, send } = props

  let ModeComponent: FC = () => <></>
  if (mode == 'predictions') {
    ModeComponent = () => <Predictions onSubmitPrediction={x => send({ type: "submit_prediction", value: x })} {...props} />
  }

  return (
    <div className="game_play">
      {
        (hand.length == 0 ?
          (admin ? <a onClick={onStart}>Start</a> : <span>Waiting for game to start...</span>)
          :
          <>
            <HandOfCards cards={hand} />
            <ModeComponent />
          </>
        )
      }
    </div>
  )
}