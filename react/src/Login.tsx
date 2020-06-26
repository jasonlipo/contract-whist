import React, { FC } from 'react';
import { IContractWhistState, IContractWhistProps } from './ContractWhist';

interface ILoginProps extends IContractWhistProps, IContractWhistState {
  onChangeName(name: string): void,
  onJoin(verb: 'create' | 'join'): void
}

export const Login: FC<ILoginProps> = ({ join_game, error, entered_game, name, game_id, onChangeName, onJoin }) => {
  return !entered_game && (
    <div className="login">
      <div className="subtitle">{join_game ? "Join a game" : "Create a game"}</div>
      {
        join_game &&
        <div><br />You are joining <b>{game_id}</b><br /><br /></div>
      }
      <form onSubmit={() => onJoin(join_game ? "join" : "create")}>
        <div className="input-box">
          <label>Your Name</label>
          <input type="text" value={name || ""} onChange={(e) => onChangeName(e.target.value)} />
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