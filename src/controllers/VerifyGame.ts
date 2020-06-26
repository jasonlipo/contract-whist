const fs = require('fs')
import { IMessage } from '../utils';
import { pool } from '../database';

const game_exists = async (id: string): Promise<boolean> => {
  if (process.env.NODE_ENV == "development") {
    return fs.existsSync("data/" + id + ".json")
  }
  else {
    let result = await pool.query("SELECT data FROM games WHERE game_id=$1", [id])
    return result.rowCount > 0
  }
}

export const VerifyGame = async (connection: any, message: IMessage, id: string): Promise<boolean> => {
  const exists = await game_exists(id)
  if ((message.type == "join_player" || message.type == "retrieve_game") && !exists) {
    connection.sendUTF(JSON.stringify({ error: "This game doesn't exist." }));
    return false;
  }
  if (message.type == "create_player" && exists) {
    connection.sendUTF(JSON.stringify({ error: "This game already exists." }));
    return false;
  }
  if (process.env.NODE_ENV == "development") {
    if (message.type == "create_player") {
      fs.mkdir('data/history/' + message.game_id, () => {})
    }
  }
  return true;
}