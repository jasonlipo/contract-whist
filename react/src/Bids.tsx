import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';

interface IBidsProps extends IContractWhistState {
  onSubmitBid(x: number): void
}

export const Bids: FC<IBidsProps> = ({ player_index, in_play, onSubmitBid, bids, cards_per_hand, players }) => {
  const sumOfPreviousBids = _.sum(bids)
  const [bid, setBid] = useState<string>(null)
  const last_player_to_bid = bids.filter(p => p == null).length == 1

  return player_index == in_play && (
    <div className="bids actions" style={{ height: 128 }}>
      <label>Enter your bid</label>
      <br /><br />
      <input type="text" value={bid == null ? "" : bid} onChange={(e) => setBid(e.target.value)} />
      {
        (bid == null || isNaN(parseInt(bid))) ?
          <><br /><br /><div className="feedback">Please enter a bid.</div></>
        :
          (parseInt(bid) >= 0 && parseInt(bid) <= cards_per_hand &&
            (!last_player_to_bid || (last_player_to_bid && (sumOfPreviousBids + parseInt(bid) != cards_per_hand)))
          )
          ? <><br /><button onClick={() => onSubmitBid(parseInt(bid))}>Submit</button></>
          : <><br /><br /><div className="feedback">Your bid is invalid.</div></>
      }
    </div>
  )
}