import React, { useState, FC } from 'react';
import { IContractWhistState, ITrump } from './ContractWhist';
import { CountdownTimer } from './CountdownTimer';

interface IChooseTrumpProps extends IContractWhistState {
  onSubmitTrump(trump: ITrump): void
}

export const ChooseTrump: FC<IChooseTrumpProps> = ({ player_index, in_play, onSubmitTrump, timer_seconds, enable_timer }) => {
  const [trump, setTrump] = useState<ITrump>(null)

  return player_index == in_play && (
    <div className="trump actions">
      <label>Your bid was the highest, please choose the trump suit</label>
      <br /><br />
      <form onSubmit={(e) => { e.preventDefault(); if (trump) { onSubmitTrump(trump); } return false; }}>
        <select value={trump || ""} onChange={(e) => setTrump((e.target.value || null) as ITrump)}>
          <option value="">Select</option>
          <option value="C">Clubs</option>
          <option value="H">Hearts</option>
          <option value="D">Diamonds</option>
          <option value="S">Spades</option>
          <option value="no_trump">No trumps</option>
        </select>
        <br />
        {
          trump &&
          <button type="submit">Submit</button>
        }
      </form>
      {
        (enable_timer && timer_seconds !== null) &&
        <CountdownTimer seconds={timer_seconds} onComplete={() => onSubmitTrump("no_trump")} />
      }
    </div>
  )
}