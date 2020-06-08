import React, { FC } from 'react';
import { deck, PlayingCard, ICard } from '@karlandin/playing-cards'

interface IHandOfCardsProps {
  cards: string[]
}

const findCardById = (id: string): ICard =>
  deck.filter(card => card.id == id)[0]

export const HandOfCards: FC<IHandOfCardsProps> = ({ cards }) =>
  <div className="cards_hand">
    {
      cards.map((c, i) =>
        <PlayingCard key={i} card={findCardById(c)} size="small" />
      )
    }
  </div>