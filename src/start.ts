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
    let adapter = new FileSync(message.game_id + '.json')
    let db = low(adapter)

    db.defaults({ players: [] }).write()

    clients[message.user_id] = ws

    switch (message.type) {
      case "new_player":
        db.get('players').push({
          user_id: message.user_id,
          name: message.value
        }).write()
        break;
    }

    const users: WebSocket[] = db.get('players').value().map((p: any) => clients[p.user_id])

    users.forEach(client => {
      client.send(JSON.stringify(db.getState()));
    });
  });
});