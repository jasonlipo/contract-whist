import React, { FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IAwaitingWebsocketProps extends IContractWhistState {
}

export const AwaitingWebsocket: FC<IAwaitingWebsocketProps> = () =>
  <div className="awaiting_websocket actions">
    Please wait...
  </div>
