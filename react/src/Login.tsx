import React, { FC } from 'react';
import { IContractWhistState, ITrump } from './ContractWhist';

interface ILoginProps extends IContractWhistState {
  onChangeName(name: string): void,
  onChangeGameId(id: string): void,
  onJoin(): void,
  onLogout(): void
}

const letterToSuit = (trump: ITrump) => {
  const map = {"C": "Clubs", "H": "Hearts", "D": "Diamonds", "S": "Spades", "no_trump": "No trumps"}
  return map[trump] || "N/A"
}

export const Login: FC<ILoginProps> = ({ entered_game, name, game_id, onChangeName, onChangeGameId, onJoin, onLogout, trump_suit, cards_per_hand}) =>
  !entered_game ?
  <div className="login">
    <div className="subtitle">Join a game</div>
    <div className="input-box">
      <label>Your Name</label>
      <input type="text" value={name} onChange={(e) => onChangeName(e.target.value)} />
    </div>
    <div className="input-box">
      <label>Game Code</label>
      <input type="text" value={game_id} onChange={(e) => onChangeGameId(e.target.value.toUpperCase())} />
    </div>
    <button onClick={() => onJoin()}>Join</button>
  </div>
  :
  <div className="game_details">
    <div className="left">
      <div className="info">
        <div>Game Code: <b>{game_id}</b></div>
        <div>Your Name: <b>{name}</b></div>
        <div>Trumps: <b>{letterToSuit(trump_suit)}</b></div>
        <div>Cards: <b>{cards_per_hand || "N/A"}</b></div>
      </div>
    </div>
    <div className="right">
      <button className="danger" onClick={() => onLogout()}>Leave Game</button>
    </div>
  </div>