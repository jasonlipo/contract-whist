import { IMessage } from '../utils';
const fs = require('fs')
const moment = require('moment')
import { pool } from '../database';

export const BroadcastResponse = async (db: any, clients: any, controller_action: boolean, message: IMessage) => {
  if (process.env.NODE_ENV == "development") {
    fs.copyFile('data/' + message.game_id + '.json', 'data/history/' + message.game_id + '/' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.json', () => {})
  }
  else {
    await pool.query("INSERT INTO history (game_id, timestamp, data) VALUES ($1, $2, $3)", [message.game_id, new Date(), await db.read()])
  }

  if (controller_action) {
    Object.keys(db.get('private').value())
      .filter(user_id => user_id in clients)
      .forEach(user_id => {
        let client = clients[user_id]
        if (client) {
          const response = { ...db.get(['private', user_id]).value(), ...db.get('shared').value() }
          client.sendUTF(JSON.stringify(response));
        }
      });
  }
}