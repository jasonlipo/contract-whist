import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import { CountdownTimer } from './CountdownTimer';

interface IEndOfTrickProps extends IContractWhistState {
  onNextTrick(): void,
  onGetScores(): void
}

export const EndOfTrick: FC<IEndOfTrickProps> = ({ admin, onNextTrick, onGetScores, hand, timer_seconds, enable_timer }) => {
  return admin && (
    <div className="end_of_trick actions">
      {
        hand.length == 0 ?
        <button onClick={() => onGetScores()}>Show Scores</button> :
        <button onClick={() => onNextTrick()}>Next Trick</button>
      }
      {
        (enable_timer && timer_seconds !== null) &&
        <CountdownTimer seconds={timer_seconds} onComplete={() => hand.length == 0 ? onGetScores() : onNextTrick()} />
      }
    </div>
  )
}