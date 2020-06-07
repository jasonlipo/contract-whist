import WebSocket, { Server } from 'ws'
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const clients: {[key: string]: WebSocket} = {}

interface Message {
  game_id: string,
  type: string,
  value?: string,
  user_id: string
}

const wss = new Server({ port: process.env.NODE_ENV === 'development' ? 3001 : 8081 });
wss.on('connection', (ws: WebSocket) => {
  ws.on('message', (data: string) => {

    let message: Message = JSON.parse(data)
    let adapter = new FileSync('data/' + message.game_id + '.json')
    let db = low(adapter)

    db.defaults({
      players: [],
      started: false
    }).write()

    clients[message.user_id] = ws

    switch (message.type) {
      case "new_player":
        db.get('players').push({
          user_id: message.user_id,
          name: message.value
        }).write()
        break;
      case "start_game":
        db.set('started', true).write()
        break;
    }

    const users: WebSocket[] = db.get('players').value()
      .filter((p: any) => p.user_id in clients)
      .map((p: any) => clients[p.user_id])

    let public_data = db.getState()
    public_data.players = public_data.players.map((p: any) => p.name)
    users.forEach(client => {
      if (client) {
        client.send(JSON.stringify(public_data));
      }
    });
  });
});