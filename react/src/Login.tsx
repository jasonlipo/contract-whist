import React, { FC } from 'react';
import { IContractWhistState, IContractWhistProps } from './ContractWhist';

interface ILoginProps extends IContractWhistProps, IContractWhistState {
  onChangeName(name: string): void,
  onJoin(verb: 'create' | 'join'): void
}

export const valid_name = (name: string) =>
/^[0-9a-zA-Z\-\s]+$/.test(name)

export const Login: FC<ILoginProps> = ({ join_game, error, entered_game, name, game_id, onChangeName, onJoin }) => {
  return !entered_game && (
    <div className="login">
      <div className="subtitle">{join_game ? "Join a game" : "Create a game"}</div>
      {
        join_game &&
        <div><br />You are joining <b>{game_id}</b><br /><br /></div>
      }
      <form onSubmit={(e) => { e.preventDefault(); if (name && valid_name(name)) { onJoin(join_game ? "join" : "create"); } return false }}>
        <div className="input-box">
          <label>Your Name</label>
          <input type="text" value={name || ""} onChange={(e) => onChangeName(e.target.value)} />
          {
            (!name || !valid_name(name)) &&
            <small><br /><em>Your name is invalid</em></small>
          }
        </div>
        {
          name &&
          <button type="submit">{join_game ? "Join" : "Create"}</button>
        }
        {
          error &&
          <div className="error">{error}</div>
        }
      </form>
    </div>
  )
}