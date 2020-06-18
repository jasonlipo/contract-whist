import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';

interface IBidsProps extends IContractWhistState {
  onSubmitBid(x: number): void
}

export const Bids: FC<IBidsProps> = ({ player_index, in_play, onSubmitBid, bids, cards_per_hand, players }) => {
  const sumOfPreviousBids = _.sum(bids)
  const [bid, setBid] = useState<number>(null)
  const last_player_to_bid = bids.filter(p => p == null).length == 1

  return (
    <div className="bids actions">
      {
        player_index == in_play ?
        <>
          <label>Enter your bid</label>
          <br /><br />
          <input type="text" value={bid} onChange={(e) => setBid(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))} />
          {
            (bid !== null && bid <= cards_per_hand &&
              (!last_player_to_bid || (last_player_to_bid && (sumOfPreviousBids + bid != cards_per_hand)))
            )
            ? <><br /><button onClick={() => onSubmitBid(bid)}>Submit</button></>
            : <><br /><br /><div className="feedback">Your bid is invalid.</div></>
          }
        </>
        :
        <span>{players[in_play]} is currently entering their bid</span>
      }
    </div>
  )
}