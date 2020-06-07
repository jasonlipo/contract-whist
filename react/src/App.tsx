import React, { Component } from 'react';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import { deck, PlayingCard } from '@karlandin/playing-cards'

interface Player {
  user_id: string,
  name: string
}

interface AppState {
  players: Player[],
  name: string
  game_id: string,
  entered_game: boolean,
  user_id: string
}

const URL = 'ws://localhost:3001'
class App extends Component<{}, AppState> {
  private ws = new WebSocket(URL)

  state: AppState = {
    players: [],
    name: null,
    game_id: null,
    entered_game: false,
    user_id: uuidv4()
  }

  reconnect() {
    console.log('connecting...')
    const ws = new WebSocket(URL)
    ws.onopen = () => {
      console.log('connected')
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
  }

  componentDidMount() {
    this.reconnect()
  }

  sendMessage(data) {
    this.ws.send(JSON.stringify(data))
  }

  join() {
    const { name, game_id, user_id } = this.state
    this.sendMessage({ type: "new_player", value: name, game_id, user_id })
  }

  render() {
    return (
      <div className="App">
        Your Name: <input type="text" value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} /><br />
        Join a game: <input type="text" value={this.state.game_id} onChange={(e) => this.setState({ game_id: e.target.value })} /><br />
        <button onClick={() => this.join()}>Join</button>
        <hr />
        {
          this.state.entered_game &&
          <div>
            <b>Game ID: {this.state.game_id}</b><br />
            Players:<br />
            { this.state.players.map(p => <div>{p.name}</div>) }
          </div>
        }
      </div>
    );
  }

}

export default App;
