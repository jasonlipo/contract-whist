import React, { FC } from 'react';
import { deck, ICard } from '@karlandin/playing-cards'
import { IContractWhistState } from './ContractWhist';
import { Card } from './Card';

interface IHandOfCardsProps extends IContractWhistState {
  cards: string[],
  onClick(i: number, card_id: string): void
}

export const findCardById = (id: string): ICard => {
  id = id.replace("14", "1")
  return deck.filter(card => card.id == id)[0]
}

export const HandOfCards: FC<IHandOfCardsProps> = ({ cards, mode, onClick, in_play, player_index, player_lead_trick, table }) => {
  const my_turn = mode == 'play' && in_play == player_index

  const canSelectCard = (id: string): boolean => {
    const card: ICard = findCardById(id)
    if (player_lead_trick == player_index) {
      // If you are first to lead
      return true
    }
    const suit_leading = findCardById(table[player_lead_trick]).suit
    const cards_of_leading_suit = cards.filter(c => findCardById(c).suit == suit_leading)
    if (cards_of_leading_suit.length > 0) {
      // Must follow suit
      return card.suit == suit_leading
    }
    // Can throw away any card or trump
    return true
  }

  return (
    <div className={"cards_hand "+(my_turn ? "selectable" : "")}>
      {
        cards.map((c, i) =>
          my_turn ?
            <div className={!canSelectCard(c) ? "invalid" : ""} key={i} onClick={canSelectCard(c) ? () => onClick(i, c) : () => {}}>
              <Card key={i} id={c} />
            </div>
          :
          <div key={i}>
            <Card key={i} id={c} />
          </div>
        )
      }
    </div>
  )
}