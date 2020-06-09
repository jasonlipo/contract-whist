import React, { FC } from 'react';

interface ILoginProps {
  entered_game: boolean,
  name: string,
  game_id: string,
  onChangeName(name: string): void,
  onChangeGameId(id: string): void,
  onJoin(): void,
  onLogout(): void
}

export const Login: FC<ILoginProps> = ({ entered_game, name, game_id, onChangeName, onChangeGameId, onJoin, onLogout }) =>
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
      </div>
    </div>
    <div className="right">
      <button className="danger" onClick={() => onLogout()}>Leave Game</button>
    </div>
  </div>