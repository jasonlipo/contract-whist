import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IInPlayProps extends IContractWhistState {
}

export const InPlay: FC<IInPlayProps> = ({ player_lead_trick, player_index, in_play, players }) => {
  return (
    <div className="in_play actions">
      {
        player_index == in_play ?
        (player_lead_trick == in_play ? <label>Your turn to lead this trick</label> : <label>Your turn</label>)
        :
        <label>{players[in_play]}'s turn</label>
      }
    </div>
  )
}