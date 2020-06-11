import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IEndOfTrickProps extends IContractWhistState {
  onNextTrick(): void,
  onGetScores(): void
}

export const EndOfTrick: FC<IEndOfTrickProps> = ({ admin, player_index, in_play, players, onNextTrick, onGetScores, hand }) => {
  return (
    <div className="end_of_trick actions">
      {
        player_index == in_play ?
        <label>You won the trick!</label>
        :
        <span>{players[in_play]} won the trick</span>
      }
      {
        admin &&
        <>
          <br /><br />
          {
            hand.length == 0 ?
            <button onClick={() => onGetScores()}>Show Scores</button> :
            <button onClick={() => onNextTrick()}>Next Trick</button>
          }
        </>
      }
    </div>
  )
}