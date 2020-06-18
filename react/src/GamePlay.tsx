import React, { FC } from 'react';
import { HandOfCards } from './HandOfCards';
import { IContractWhistState } from './ContractWhist';
import { Bids } from './Bids';
import { ChooseTrump } from './ChooseTrump';
import { AwaitingStart } from './AwaitingStart';
import { InPlay } from './InPlay';
import { CardTable } from './CardTable';
import { EndOfTrick } from './EndOfTrick';
import { Scores } from './Scores';
import { AwaitingWebsocket } from './AwaitingWebsocket';

interface IGamePlayProps extends IContractWhistState {
  onStart(): void
}

export const GamePlay: FC<IGamePlayProps> = (props) => {
  const { mode, hand, admin, onStart, send } = props

  let ModeComponent: FC = () => <></>
  if (mode == 'bids') {
    ModeComponent = () => <Bids onSubmitBid={x => send({ type: "submit_bid", value: x })} {...props} />
  }
  else if (mode == 'choose_trump') {
    ModeComponent = () => <ChooseTrump onSubmitTrump={suit => send({ type: "submit_trump", value: suit })} {...props} />
  }
  else if (mode == 'play') {
    ModeComponent = () => <InPlay {...props} />
  }
  else if (mode == 'end_of_trick') {
    ModeComponent = () => <EndOfTrick onNextTrick={() => send({ type: "next_trick" })} onGetScores={() => send({ type: "get_scores" })} {...props} />
  }
  else if (mode == 'scores') {
    ModeComponent = () => <Scores onNextRound={() => send({ type: "next_round" })} {...props} />
  }
  else if (mode == 'awaiting_websocket') {
    ModeComponent = () => <AwaitingWebsocket {...props} />
  }

  return (
    <div className="game_play">
      <div className="table">
        <CardTable {...props} />
      </div>
      <div className="control_panel">
        {
          (mode == 'players_joining' ?
            <AwaitingStart admin={admin} onStart={onStart} />
            :
            <>
              {
                (mode != 'scores') &&
                <HandOfCards
                  {...props}
                  cards={hand}
                  onClick={(i, id) => send({ type: "play_card", value: i, card_id: id })}
                />
              }
              <ModeComponent />
            </>
          )
        }
      </div>
    </div>
  )
}