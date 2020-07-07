import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import { CountdownTimer } from './CountdownTimer';
import { canSelectCard } from './HandOfCards';
import _ from 'lodash';

interface IInPlayProps extends IContractWhistState {
}

export const InPlay: FC<IInPlayProps> = ({ in_play, player_index, timer_seconds, hand, send, table, player_lead_trick }) => {
  let can_select
  if (in_play == player_index) {
    can_select = canSelectCard(table, player_lead_trick, player_index, hand)
    let automatic_play_card = 0
    let randomise_hand = _.shuffle(hand.map((_x, i) => i))
    while (!can_select(hand[randomise_hand[automatic_play_card]])) {
      automatic_play_card++
    }

    return in_play == player_index && timer_seconds !== null && (
      <div className="actions">
        <CountdownTimer
          seconds={timer_seconds}
          onComplete={() => send({ type: "play_card", value: randomise_hand[automatic_play_card], card_id: hand[randomise_hand[automatic_play_card]] })}
        />
      </div>
    )
  }
  return null
}