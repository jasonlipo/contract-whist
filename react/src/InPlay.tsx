import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import { CountdownTimer } from './CountdownTimer';
import { canSelectCard } from './HandOfCards';

interface IInPlayProps extends IContractWhistState {
}

export const InPlay: FC<IInPlayProps> = ({ in_play, player_index, timer_seconds, hand, send, table, player_lead_trick }) => {
  const can_select = canSelectCard(table, player_lead_trick, player_index, hand)
  let automatic_play_card = 0
  while (!can_select(hand[automatic_play_card])) {
    automatic_play_card++
  }

  return in_play == player_index && timer_seconds !== null && (
    <div className="actions">
      <CountdownTimer seconds={timer_seconds} onComplete={() => send({ type: "play_card", value: automatic_play_card, card_id: hand[automatic_play_card] })} />
    </div>
  )
}