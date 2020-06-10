import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IEndOfTrickProps extends IContractWhistState {
}

export const EndOfTrick: FC<IEndOfTrickProps> = ({ player_index, in_play, players }) => {
  return (
    <div className="end_of_trick actions">
      {
        player_index == in_play ?
        <label>You won the trick!</label>
        :
        <span>{players[in_play]} won the trick</span>
      }
    </div>
  )
}