import React, { FC } from 'react';
import { PlayingCard } from '@karlandin/playing-cards';
import { findCardById } from './HandOfCards';

interface ICardProps {
  id: string
}

export const Card: FC<ICardProps> = ({ id }) =>
  <PlayingCard card={findCardById(id)} size="fill" />