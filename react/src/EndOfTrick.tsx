import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IEndOfTrickProps extends IContractWhistState {
  onNextTrick(): void,
  onGetScores(): void
}

export const EndOfTrick: FC<IEndOfTrickProps> = ({ admin, onNextTrick, onGetScores, hand }) => {
  return admin && (
    <div className="end_of_trick actions">
      {
        hand.length == 0 ?
        <button onClick={() => onGetScores()}>Show Scores</button> :
        <button onClick={() => onNextTrick()}>Next Trick</button>
      }
    </div>
  )
}