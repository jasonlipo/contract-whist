import React, { Component } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { IContractWhistState } from './ContractWhist';
import { Loading } from './Loading';
import { Login } from './Login';

const URL = 'ws://127.0.0.1:80'

interface IConnectionProps {
  name: string
  game_id: string,
  entered_game: boolean,
  user_id: string,
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
        if (this.props.entered_game) {
          this.sendMessage({ type: "retrieve_game" })
        }
        res()
      }

      ws.onmessage = evt => {
        const message = JSON.parse(evt.data)
        console.log(message)
        this.props.setState({ ...message, entered_game: true })
      }

      ws.onclose = () => {
        console.log('disconnected')
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
    const game_id = localStorage.getItem('game_id')
    if (user_id && game_id) {
      this.props.setState({ game_id, user_id, name })
      this.sendMessage({ type: "retrieve_game" })
    }
    else {
      this.props.setState({ user_id: uuidv4() })
    }
  }

  sendMessage(data) {
    const { game_id, user_id, name } = this.props
    this.ws.send(JSON.stringify({ ...data, game_id, user_id, name }))
  }

  join() {
    const { name, game_id, user_id } = this.props
    localStorage.setItem('user_id', user_id)
    localStorage.setItem('game_id', game_id)
    localStorage.setItem('name', name)
    this.sendMessage({ type: "new_player", value: name })
  }

  logout() {
    localStorage.removeItem('user_id')
    localStorage.removeItem('game_id')
    localStorage.removeItem('name')
    location.reload()
  }

  render() {
    return (
      <div className="connection">
        {
          this.props.user_id === null ?
          <Loading />
          :
          <Login
            name={this.props.name}
            game_id={this.props.game_id}
            entered_game={this.props.entered_game}
            onChangeName={name => this.props.setState({ name })}
            onChangeGameId={game_id => this.props.setState({ game_id })}
            onJoin={this.join.bind(this)}
            onLogout={this.logout.bind(this)}
          />
        }
      </div>
    );
  }

}

