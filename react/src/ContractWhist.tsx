import React, { Component } from 'react';
import Connection from './Connection';
import { GamePlay } from './GamePlay';
import { Log } from './Log';

export type ISuit = 'C' | 'H' | 'S' | 'D'
export type ITrump = ISuit | 'no_trump'
export type ICard = string
export type IPlayerPosition = number
export type IMode = 'awaiting_websocket' | 'players_joining' | 'bids' | 'choose_trump' | 'play' | 'end_of_trick' | 'scores'

export interface ILog {
  datetime: string,
  player_name: string,
  action: string
}

export interface IContractWhistProps {
  join_game: string
}

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
  bids: number[],
  trump_suit: ITrump,
  table: ICard[],
  tricks_won: number[],
  player_lead_trick: IPlayerPosition,
  points: number[],
  cards_decreasing: boolean,
  error: string,
  connection_status: [boolean, string],
  log: ILog[],
  points_history: {[name: string]: number[]}
}

export default class ContractWhist extends Component<IContractWhistProps, IContractWhistState> {
  state: IContractWhistState = {
    players: [],
    points: [],
    name: null,
    player_index: null,
    player_bid_first: null,
    game_id: this.props.join_game ||  Math.random().toString(36).substr(2).toUpperCase(),
    entered_game: false,
    user_id: null,
    cards_per_hand: null,
    mode: null,
    send: null,
    hand: [],
    in_play: null,
    admin: null,
    bids: [],
    trump_suit: null,
    table: [],
    tricks_won: [],
    player_lead_trick: null,
    cards_decreasing: null,
    error: null,
    connection_status: [null, null],
    log: [],
    points_history: {}
  }

  render() {
    return (
      <>
      <div className="contract-whist-container">
        {
          this.state.connection_status[0] !== null &&
          (
            this.state.connection_status[0] ?
            <div className="connection-status green">{this.state.connection_status[1]}</div> :
            <div className="connection-status red">{this.state.connection_status[1]}</div>
          )
        }
          <div className="contract-whist">
            <Connection
              {...this.props}
              {...this.state}
              onConnect={send => this.setState({ send })}
              setState={this.setState.bind(this)}
            />
            { this.state.entered_game &&
              <GamePlay {...this.state} />
            }
          </div>
        </div>
        {
          this.state.entered_game &&
          <Log onStart={() => this.state.send({ type: "start_game" })} {...this.state} />
        }
      </>
    )
  }

}

