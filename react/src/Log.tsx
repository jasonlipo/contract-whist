import React, { FC, Component, RefObject } from 'react';
import { IContractWhistState, ITrump } from './ContractWhist';
import { Bids } from './Bids';
import { ChooseTrump } from './ChooseTrump';
import { EndOfTrick } from './EndOfTrick';
import { Scores, print_scores_log } from './Scores';
import { AwaitingWebsocket } from './AwaitingWebsocket';
import moment from 'moment';
import { AwaitingStart } from './AwaitingStart';
import { ResizableBox } from 'react-resizable';
import { InPlay } from './InPlay';

export enum ELogMessages {
  CREATE_GAME = "created the game",
  JOIN_GAME = "joined the game",
  RENAME_PLAYER = "changed their name to [X]",
  PRINT_SCORES = "",
  START_FIRST_ROUND = "started the game with 10 cards",
  START_ROUND = "started a new round with [X] cards",
  FIRST_BIDDER = "is first to bid",
  NEXT_TO_BID = "is next to bid",
  MADE_BID = "made a bid of [X]",
  BID_ZERO_REDEAL = "bid 0 which means the cards are re-dealt",
  CHOOSING_TRUMP = "is choosing the trump suit",
  CHOSEN_TRUMP = "set the trump suit to [X]",
  LEADING_FIRST_TRICK = "is leading the first trick",
  LEADING_TRICK = "is leading this trick",
  WON_TRICK = "won the trick",
  CHANGE_SETTINGS = "changed the game settings"
}

interface ILogProps extends IContractWhistState {
  onStart(): void
}

export class Log extends Component<ILogProps> {
  private boxRef: RefObject<HTMLDivElement>

  constructor(props: ILogProps) {
		super(props);
		this.boxRef = React.createRef()
  }

  scrollToBottom = () => {
		this.boxRef.current.scrollTop = this.boxRef.current.scrollHeight;
  }

  replaceMyPlayer = (action: number, player: number, data?: string) => {
    let action_string = ELogMessages[Object.keys(ELogMessages)[action]]
    if (data) {
      action_string = action_string.replace("[X]", data)
    }
    if (player == this.props.player_index) {
      return action_string.replace("is ", "are ")
    }
    return action_string
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  componentDidUpdate() {
    this.scrollToBottom()
  }

  letterToSuit = (trump: ITrump) => {
    const map = {"C": "Clubs", "H": "Hearts", "D": "Diamonds", "S": "Spades", "no_trump": "No trumps"}
    return map[trump] || "N/A"
  }

  render() {
    const { mode, send, admin, onStart, trump_suit, cards_per_hand, players, points_history, points } = this.props
    let ModeComponent: FC = () => <></>
    if (mode == 'players_joining') {
      ModeComponent = () => <AwaitingStart admin={admin} onStart={onStart} />
    }
    else if (mode == 'bids') {
      ModeComponent = () => <Bids onSubmitBid={x => send({ type: "submit_bid", value: x })} {...this.props} />
    }
    else if (mode == 'choose_trump') {
      ModeComponent = () => <ChooseTrump onSubmitTrump={suit => send({ type: "submit_trump", value: suit })} {...this.props} />
    }
    else if (mode == 'end_of_trick') {
      ModeComponent = () => <EndOfTrick onNextTrick={() => send({ type: "next_trick" })} onGetScores={() => send({ type: "get_scores" })} {...this.props} />
    }
    else if (mode == 'scores') {
      ModeComponent = () => <Scores onNextRound={() => send({ type: "next_round" })} {...this.props} />
    }
    else if (mode == 'awaiting_websocket') {
      ModeComponent = () => <AwaitingWebsocket {...this.props} />
    }
    else if (mode == 'play') {
      ModeComponent = () => <InPlay {...this.props} />
    }

    return (
      <ResizableBox width={260} height={Infinity} axis='x' resizeHandles={['w']}>
        <div className="log">
          <div className="log-item log-border-bottom">
            <div className="log-name" style={{display: 'inline-block', width: '125px'}}>Trump Suit</div>
            <div className="log-action">{this.letterToSuit(trump_suit)}</div>
            <br />
            <div className="log-name" style={{display: 'inline-block', width: '125px'}}>Cards This Round</div>
            <div className="log-action">{cards_per_hand || "N/A"}</div>
          </div>
          <div className="log-scrollable" ref={this.boxRef}>
            {
              this.props.log.map(([ datetime, player_index, action, data ], i) =>
                <div key={i} className="log-item">
                  <div className="log-date">[{moment(datetime).format('HH:mm:ss')}]</div>
                  {
                    (player_index == -1 && action == Object.keys(ELogMessages).indexOf("PRINT_SCORES")) ?
                    print_scores_log(parseInt(data), players, points_history) :
                    <>
                      <div className="log-name">{players[player_index].replace(new RegExp('^' + this.props.name + '$'), "You")}</div>
                      <div className="log-action">{this.replaceMyPlayer(action, player_index, data)}</div>
                    </>
                  }
                </div>
              )
            }
            <ModeComponent />
          </div>
        </div>
      </ResizableBox>
    )
  }
}