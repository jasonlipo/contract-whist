import React, { FC } from 'react';
import { HandOfCards } from './HandOfCards';
import { IContractWhistState } from './ContractWhist';
import { Predictions } from './Predictions';
import { ChooseTrump } from './ChooseTrump';
import { AwaitingStart } from './AwaitingStart';
import { InPlay } from './InPlay';

interface IGamePlayProps extends IContractWhistState {
  onStart(): void
}

export const GamePlay: FC<IGamePlayProps> = (props) => {
  const { mode, hand, admin, onStart, send } = props

  let ModeComponent: FC = () => <></>
  if (mode == 'predictions') {
    ModeComponent = () => <Predictions onSubmitPrediction={x => send({ type: "submit_prediction", value: x })} {...props} />
  }
  else if (mode == 'choose_trump') {
    ModeComponent = () => <ChooseTrump onSubmitTrump={suit => send({ type: "submit_trump", value: suit })} {...props} />
  }
  else if (mode == 'play') {
    ModeComponent = () => <InPlay {...props} />
  }

  return (
    <div className="game_play">
      <div className="table">

      </div>
      <div className="control_panel">
        {
          (hand.length == 0 ?
            <AwaitingStart admin={admin} onStart={onStart} />
            :
            <>
              <HandOfCards cards={hand} />
              <ModeComponent />
            </>
          )
        }
      </div>
    </div>
  )
}