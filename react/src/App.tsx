import React, { Component } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { deck, PlayingCard } from '@karlandin/playing-cards'

interface AppState {
  players: string[],
  name: string
  game_id: string,
  entered_game: boolean,
  user_id: string,
  started: boolean
}

const URL = 'ws://localhost:3001'
class App extends Component<{}, AppState> {
  private ws = new WebSocket(URL)

  state: AppState = {
    players: [],
    name: null,
    game_id: null,
    entered_game: false,
    user_id: null,
    started: false
  }

  reconnect() {
    return new Promise((res, rej) => {
      console.log('connecting...')
      const ws = new WebSocket(URL)
      ws.onopen = () => {
        console.log('connected')
        if (this.state.entered_game) {
          this.sendMessage({ type: "retrieve_game", game_id: this.state.game_id, user_id: this.state.user_id })
        }
        res()
      }

      ws.onmessage = evt => {
        const message = JSON.parse(evt.data)
        console.log(message)
        this.setState({ ...message, entered_game: true })
      }

      ws.onclose = () => {
        console.log('disconnected')
        setTimeout(this.reconnect.bind(this), 1000)
      }
      this.ws = ws
    })
  }

  async componentDidMount() {
    await this.reconnect()
    const user_id = localStorage.getItem('user_id')
    const name = localStorage.getItem('name')
    const game_id = localStorage.getItem('game_id')
    if (user_id && game_id) {
      this.setState({ game_id, user_id, name })
      this.sendMessage({ type: "retrieve_game", game_id, user_id })
    }
    else {
      this.setState({ user_id: uuidv4() })
    }
  }

  sendMessage(data) {
    const { game_id, user_id } = this.state
    this.ws.send(JSON.stringify({ ...data, game_id, user_id }))
  }

  join() {
    const { name, game_id, user_id } = this.state
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

  start() {
    this.sendMessage({ type: "start_game" })
  }

  render() {
    return (
      <div className="App">
        {
          !this.state.entered_game &&
          <>
            Your Name: <input type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} /><br />
            Join a game: <input type="text" value={this.state.game_id} onChange={(e) => this.setState({ game_id: e.target.value })} /><br />
            <button onClick={() => this.join()}>Join</button>
          </>
        }
        <hr />
        {
          this.state.entered_game &&
          <div>
            <b>Game ID: {this.state.game_id}</b><br />
            Players:<br />
            { this.state.players.map(p => <div>{p}</div>) }
            <br /><a href="#" onClick={() => this.logout()}>Logout</a>
            <br /><br />
            {
              this.state.started ? <div>The game has started</div> :
              <a href="#" onClick={() => this.start()}>Start Game</a>
            }
          </div>
        }
      </div>
    );
  }

}

export default App;
