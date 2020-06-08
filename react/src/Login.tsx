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
  <>
    Your Name: <input type="text" value={name} onChange={(e) => onChangeName(e.target.value)} /><br />
    Join a game: <input type="text" value={game_id} onChange={(e) => onChangeGameId(e.target.value)} /><br />
    <button onClick={() => onJoin()}>Join</button>
  </>
  :
  <div>
    Game ID: <b>{game_id}</b><br />
    Your Name: <b>{name}</b><br />
    <a href="#" onClick={() => onLogout()}>Logout</a>
  </div>