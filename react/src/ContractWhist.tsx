import React, { Component } from 'react';
import Connection from './Connection';
import { HandOfCards } from './HandOfCards';
import { GamePlay } from './GamePlay';

export interface IContractWhistState {
  players: string[],
  name: string
  game_id: string,
  entered_game: boolean,
  user_id: string,
  cards_per_hand: number,
  mode: 'players_joining' | 'predictions' | 'choose_trump' | 'play' | 'scores',
  send: (data: any) => void,
  hand: string[],
  in_play: string,
  admin: boolean,
  predictions: number[]
}

export default class ContractWhist extends Component<{}, IContractWhistState> {
  state: IContractWhistState = {
    players: [],
    name: null,
    game_id: null,
    entered_game: false,
    user_id: null,
    cards_per_hand: null,
    mode: null,
    send: null,
    hand: [],
    in_play: null,
    admin: null,
    predictions: []
  }

  render() {
    return (
      <div className="App">
        <Connection
          name={this.state.name}
          game_id={this.state.game_id}
          user_id={this.state.user_id}
          entered_game={this.state.entered_game}
          onConnect={send => this.setState({ send })}
          setState={this.setState.bind(this)}
        />
        { this.state.entered_game &&
          <GamePlay
            onStart={() => this.state.send({ type: "start_game" })}
            {...this.state}
          />
        }
      </div>
    )
  }

}

