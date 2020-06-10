import React, { FC } from 'react';
import { deck, PlayingCard, ICard } from '@karlandin/playing-cards'
import { IMode, IPlayerPosition } from './ContractWhist';

interface IHandOfCardsProps {
  cards: string[],
  mode: IMode,
  onClick(i: number): void,
  in_play: IPlayerPosition,
  player_index: IPlayerPosition
}

export const findCardById = (id: string): ICard =>
  deck.filter(card => card.id == id)[0]

export const HandOfCards: FC<IHandOfCardsProps> = ({ cards, mode, onClick, in_play, player_index }) => {
  const my_turn = mode == 'play' && in_play == player_index

  const clickCard = (i: number) => {
    if (my_turn) {
      onClick(i)
    }
  }

  return (
    <div className={"cards_hand "+(my_turn ? "selectable" : "")}>
      {
        cards.map((c, i) =>
          <div key={i} onClick={() => clickCard(i)}>
            <PlayingCard key={i} card={findCardById(c)} size="fill" />
          </div>
        )
      }
    </div>
  )
}