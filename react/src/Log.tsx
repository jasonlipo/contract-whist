import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import moment from 'moment';

interface ILogProps extends IContractWhistState {
}

export const Log: FC<ILogProps> = ({ log, name }) => {
  const replaceMyPlayer = (action: string, player: string) => {
    if (player == name) {
      return action.replace("is ", "are ")
    }
    return action
  }

  return (
    <div className="log">
      {
        log.map(({ datetime, player_name, action }) =>
          <div className="log-item">
            <div className="log-date">[{moment(datetime).format('HH:mm:ss')}]</div>
            <div className="log-name">{player_name.replace(name, "You")}</div>
            <div className="log-action">{replaceMyPlayer(action, player_name)}</div>
          </div>
        )
      }
    </div>
  )
}