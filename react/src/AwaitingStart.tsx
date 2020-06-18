import React, { FC } from 'react';

interface IAwaitingStartProps {
  onStart(): void,
  admin: boolean
}

export const AwaitingStart: FC<IAwaitingStartProps> = ({ admin, onStart }) =>
  <div className="actions instruction">
    {
      admin ?
        <>Players are joining now. When you're ready, click Start below:<br /><button onClick={onStart}>Start</button></> :
        <>Waiting for game to start...</>
    }
  </div>