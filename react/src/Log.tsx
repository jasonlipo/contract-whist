import React, { FC, Component, RefObject } from 'react';
import { IContractWhistState, ITrump } from './ContractWhist';
import { Bids } from './Bids';
import { ChooseTrump } from './ChooseTrump';
import { EndOfTrick } from './EndOfTrick';
import { Scores } from './Scores';
import { AwaitingWebsocket } from './AwaitingWebsocket';
import moment from 'moment';
import { AwaitingStart } from './AwaitingStart';

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

  replaceMyPlayer = (action: string, player: string) => {
    if (player == this.props.name) {
      return action.replace("is ", "are ")
    }
    return action
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
    const { mode, send, admin, onStart, trump_suit, cards_per_hand } = this.props
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

    return (
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
            this.props.log.map(({ datetime, player_name, action }, i) =>
              <div key={i} className="log-item">
                <div className="log-date">[{moment(datetime).format('HH:mm:ss')}]</div>
                <div className="log-name">{player_name.replace(this.props.name, "You")}</div>
                <div className="log-action" dangerouslySetInnerHTML={{__html: this.replaceMyPlayer(action, player_name)}}></div>
              </div>
            )
          }
          <ModeComponent />
        </div>
      </div>
    )
  }
}