import React, { Component } from 'react';
import Connection from './Connection';
import { GamePlay } from './GamePlay';

export type ISuit = 'C' | 'H' | 'S' | 'D'
export type ITrump = ISuit | 'no_trump'
export type ICard = string
export type IPlayerPosition = number
export type IMode = 'players_joining' | 'predictions' | 'choose_trump' | 'play' | 'end_of_trick' | 'scores'

export interface IContractWhistState {
  players: string[],
  name: string,
  player_index: IPlayerPosition,
  player_bid_first: IPlayerPosition,
  game_id: string,
  entered_game: boolean,
  user_id: string,
  cards_per_hand: number,
  mode: IMode,
  send: (data: any) => void,
  hand: ICard[],
  in_play: IPlayerPosition,
  admin: boolean,
  predictions: number[],
  trump_suit: ITrump,
  table: ICard[],
  tricks_won: number[],
  player_lead_trick: IPlayerPosition,
  points: number[],
  cards_decreasing: boolean,
  error: string
}

export default class ContractWhist extends Component<{}, IContractWhistState> {
  state: IContractWhistState = {
    players: [],
    points: [],
    name: null,
    player_index: null,
    player_bid_first: null,
    game_id: null,
    entered_game: false,
    user_id: null,
    cards_per_hand: null,
    mode: null,
    send: null,
    hand: [],
    in_play: null,
    admin: null,
    predictions: [],
    trump_suit: null,
    table: [],
    tricks_won: [],
    player_lead_trick: null,
    cards_decreasing: null,
    error: null
  }

  render() {
    return (
      <div className="contract-whist">
        <div className="title">Contract Whist<br /><small>By Jason Lipowicz</small></div>
        <Connection
          {...this.state}
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

