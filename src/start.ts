import { generate_deck, IMessage, initialise } from './utils';
import { CreateJoinPlayer, StartGame, SubmitPrediction, SubmitTrump, PlayCard,
         NextTrick, GetScores, NextRound, VerifyGame, BroadcastResponse} from './controllers';
const WebSocketServer = require('websocket').server;
const path = require('path')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const clients = {}

const express = require('express')
const app = express()
app.use('/', express.static(path.join(__dirname, 'react')))
app.get('/*', (_req, res) => res.sendFile(__dirname + '/react/index.html'))
const server = app.listen(process.env.PORT || 3000)

const deck = generate_deck()

const wss = new WebSocketServer({ httpServer: server });
wss.on('request', ws => {
  const connection = ws.accept(null, ws.origin);
  connection.on('message', raw => {
    let controller_action: boolean = true;
    let message: IMessage = JSON.parse(raw.utf8Data)
    const filename = 'data/' + message.game_id + '.json'
    controller_action = VerifyGame(connection, message, filename)
    if (!controller_action) return;

    let adapter = new FileSync(filename)
    let db = low(adapter)

    initialise(db, message)
    clients[message.user_id] = connection

    switch (message.type) {
      case "create_player": case "join_player": controller_action = CreateJoinPlayer(db, connection, message); break;
      case "start_game": controller_action = StartGame(db, message, deck); break;
      case "submit_prediction": controller_action = SubmitPrediction(db, message, deck); break;
      case "submit_trump": controller_action = SubmitTrump(db, message); break;
      case "play_card": controller_action = PlayCard(db, message); break;
      case "next_trick": controller_action = NextTrick(db); break;
      case "get_scores": controller_action = GetScores(db); break;
      case "next_round": controller_action = NextRound(db, message, deck);break;
    }

    BroadcastResponse(db, clients, controller_action, filename, message)
  });
});