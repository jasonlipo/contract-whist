import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IContractWhistState, IContractWhistProps } from './ContractWhist';
import { Loading } from './Loading';
import { Login } from './Login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

let URL
if (process.env.NODE_ENV == "development") {
  URL = 'ws://localhost:3000'
}
else {
  URL = location.origin.replace(/^http/, 'ws')
}

interface IConnectionProps extends IContractWhistProps, IContractWhistState {
  onConnect(sendMessage: (data: any) => void): void,
  setState(updates: Partial<IContractWhistState>): void
}

export default class Connection extends Component<IConnectionProps> {
  private ws = new WebSocket(URL)

  reconnect() {
    return new Promise((res, rej) => {
      console.log('connecting...')
      const ws = new WebSocket(URL)
      ws.onopen = () => {
        console.log('connected')
        if (this.props.connection_status[0] === false) {
          this.props.setState({ connection_status: [true, "Connected!"] })
          setTimeout(() => this.props.setState({ connection_status: [null, null] }), 1000)
        }
        if (this.props.entered_game) {
          this.sendMessage({ type: "retrieve_game" })
        }
        res()
      }

      ws.onmessage = evt => {
        const message = JSON.parse(evt.data)
        console.log('Received', message)
        if (message.entered_game && message.game_id && location.pathname == "/") {
          location.href = '/' + message.game_id
        }
        this.props.setState(message)
      }

      ws.onclose = () => {
        console.log('disconnected')
        this.props.setState({ connection_status: [false, "You are not connected to the Internet. Reconnecting..."] })
        setTimeout(this.reconnect.bind(this), 1000)
      }
      this.ws = ws
      this.props.onConnect(this.sendMessage.bind(this))
    })
  }

  async componentDidMount() {
    await this.reconnect()
    const user_id = localStorage.getItem('user_id')
    const name = localStorage.getItem('name')
    const game_id = this.props.join_game || localStorage.getItem('game_id')
    if (user_id && game_id) {
      this.props.setState({ game_id, user_id, name })
      this.sendMessage({ type: "retrieve_game" })
    }
    else {
      this.props.setState({ user_id: uuidv4() })
    }
  }

  sendMessage(data) {
    const { game_id, user_id, player_index, name } = this.props
    const message = { ...data, game_id, user_id, name, player_index }
    console.log('Sent', message)
    this.ws.send(JSON.stringify(message))
    this.props.setState({ mode: 'awaiting_websocket' })
  }

  join(verb: 'create' | 'join') {
    const { name, game_id, user_id } = this.props
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('game_id', game_id)
    localStorage.setItem('name', name)
    this.sendMessage({ type: verb + "_player", value: name })
  }

  logout() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('game_id')
    localStorage.removeItem('name')
    location.href = '/'
  }

  render() {
    return (
      <div className="connection">
        <div className="title">Contract Whist</div>
        <div className="leave_game">
          {
            this.props.entered_game &&
            <button className="danger" onClick={() => this.logout()}>Leave Game</button>
          }
          {
            this.props.admin &&
            <button className="settings" onClick={() => this.props.setState({ admin_settings_open: true })}>
              <FontAwesomeIcon icon={faCog} />
            </button>
          }
        </div>
        {
          this.props.user_id === null ?
          <Loading />
          :
          <Login
            {...this.props}
            onChangeName={name => this.props.setState({ name })}
            onJoin={this.join.bind(this)}
          />
        }
      </div>
    );
  }

}

