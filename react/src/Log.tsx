import React, { Component, RefObject } from 'react';
import { IContractWhistState } from './ContractWhist';
import moment from 'moment';

interface ILogProps extends IContractWhistState {
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

  render() {
    return (
      <div className="log" ref={this.boxRef}>
        {
          this.props.log.map(({ datetime, player_name, action }) =>
            <div className="log-item">
              <div className="log-date">[{moment(datetime).format('HH:mm:ss')}]</div>
              <div className="log-name">{player_name.replace(this.props.name, "You")}</div>
              <div className="log-action">{this.replaceMyPlayer(action, player_name)}</div>
            </div>
          )
        }
      </div>
    )
  }
}