import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';
import { CountdownTimer } from './CountdownTimer';

interface IBidsProps extends IContractWhistState {
  onSubmitBid(x: number): void
}

export const Bids: FC<IBidsProps> = ({ player_index, in_play, onSubmitBid, bids, cards_per_hand, timer_seconds }) => {
  const sumOfPreviousBids = _.sum(bids)
  const [bid, setBid] = useState<string>(null)
  const last_player_to_bid = bids.filter(p => p == null).length == 1

  const is_valid_bid = (try_bid: number): boolean =>
    try_bid >= 0 && try_bid <= cards_per_hand && (!last_player_to_bid || (last_player_to_bid && (sumOfPreviousBids + try_bid != cards_per_hand)))

  const run_out_of_time_bid = is_valid_bid(0) ? 0 : 1

  return player_index == in_play && (
    <div className="bids actions" style={{ height: 128 }}>
      <label>Enter your bid</label>
      <br /><br />
      <form onSubmit={(e) => { e.preventDefault(); onSubmitBid(parseInt(bid)); return false; }}>
        <input type="text" value={bid == null ? "" : bid} onChange={(e) => setBid(e.target.value)} />
        {
          (bid == null || isNaN(parseInt(bid))) ?
            <><br /><br /><div className="feedback">Please enter a bid.</div></>
          :
            is_valid_bid(parseInt(bid))
            ? <><br /><button type="submit">Submit</button></>
            : <><br /><br /><div className="feedback">Your bid is invalid.</div></>
        }
      </form>
      {
        timer_seconds !== null &&
        <CountdownTimer seconds={timer_seconds} onComplete={() => onSubmitBid(run_out_of_time_bid)} />
      }
    </div>
  )
}