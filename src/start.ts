import { generate_deck, IMessage, initialise, generate_db } from './utils';
import { CreateJoinPlayer, StartGame, SubmitBid, SubmitTrump, PlayCard,
         NextTrick, GetScores, NextRound, VerifyGame, BroadcastResponse} from './controllers';
const WebSocketServer = require('websocket').server;
const path = require('path')
const fs = require('fs')
const glob = require("glob")
const bodyParser = require('body-parser')
const clients = {}

const express = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use('/', express.static(path.join(__dirname, 'react')))
app.get('/files', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
  glob("data/*.json", {}, function (err, files) {
    res.send({ files: files.map(f => f.replace("data/", "").replace(".json", "")) })
  })
})
app.get('/fetch/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
  res.send({
    code: fs.readFileSync('data/' + req.params.id + '.json', 'utf8')
  })
})
app.post('/fetch/:id', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin',  "http://localhost:3001");
  fs.writeFileSync('data/' + req.params.id + '.json', JSON.parse(req.body.code).toString())
  res.send({
    response: true
  })
})
app.get('/*', (_req, res) => res.sendFile(__dirname + '/react/index.html'))
const server = app.listen(process.env.PORT || 3000)

const deck = generate_deck()

const wss = new WebSocketServer({ httpServer: server });
wss.on('request', ws => {
  const connection = ws.accept(null, ws.origin);
  connection.on('message', raw => {
    try {
      let controller_action: boolean = true;
      let message: IMessage = JSON.parse(raw.utf8Data)
      const filename = 'data/' + message.game_id + '.json'
      controller_action = VerifyGame(connection, message, filename)
      if (!controller_action) return;

      let db = generate_db(filename)

      initialise(db, message)
      clients[message.user_id] = connection

      switch (message.type) {
        case "create_player": case "join_player": controller_action = CreateJoinPlayer(db, connection, message); break;
        case "start_game": controller_action = StartGame(db, message, deck); break;
        case "submit_bid": controller_action = SubmitBid(db, message, deck); break;
        case "submit_trump": controller_action = SubmitTrump(db, message); break;
        case "play_card": controller_action = PlayCard(db, message); break;
        case "next_trick": controller_action = NextTrick(db); break;
        case "get_scores": controller_action = GetScores(db); break;
        case "next_round": controller_action = NextRound(db, message, deck);break;
      }

      BroadcastResponse(db, clients, controller_action, filename, message)
    }
    catch (e) {
      console.error('Error: ' + e)
    }
  });
});