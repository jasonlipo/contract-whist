import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IChooseTrumpProps extends IContractWhistState {
  onSubmitTrump(suit: string): void
}

export const ChooseTrump: FC<IChooseTrumpProps> = ({ name, in_play, onSubmitTrump }) => {
  const [trump, setTrump] = useState<string>("")

  return (
    <div className="predictions">
      {
        name == in_play ?
        <>
          <label>You picked the highest prediction, please choose the trump suit</label>
          <br />
          <select value={trump} onChange={(e) => setTrump(e.target.value)}>
            <option value="">Select</option>
            <option value="C">Clubs</option>
            <option value="H">Hearts</option>
            <option value="D">Diamonds</option>
            <option value="S">Spades</option>
          </select>
          <br />
          <button onClick={() => onSubmitTrump(trump)}>Submit</button>
        </>
        :
        <span>{in_play} is currently choosing the trump suit</span>
      }
    </div>
  )
}