import React, { FC } from 'react';
import { IContractWhistState, ITrump, IContractWhistProps } from './ContractWhist';

interface ILoginProps extends IContractWhistProps, IContractWhistState {
  onChangeName(name: string): void,
  onJoin(verb: 'create' | 'join'): void,
  onLogout(): void
}

const letterToSuit = (trump: ITrump) => {
  const map = {"C": "Clubs", "H": "Hearts", "D": "Diamonds", "S": "Spades", "no_trump": "No trumps"}
  return map[trump] || "N/A"
}

export const Login: FC<ILoginProps> = ({ join_game, error, entered_game, name, game_id, onChangeName, onJoin, onLogout, trump_suit, cards_per_hand}) => {
  return (
    !entered_game ?
    <div className="login">
      <div className="subtitle">{join_game ? "Join a game" : "Create a game"}</div>
      {
        join_game &&
        <div><br />You are joining <b>{game_id}</b><br /><br /></div>
      }
      <div className="input-box">
        <label>Your Name</label>
        <input type="text" value={name} onChange={(e) => onChangeName(e.target.value)} />
      </div>
      {
        name &&
        <button onClick={() => onJoin(join_game ? "join" : "create")}>{join_game ? "Join" : "Create"}</button>
      }
      {
        error &&
        <div className="error">{error}</div>
      }
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
  )
}