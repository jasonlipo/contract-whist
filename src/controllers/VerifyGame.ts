const fs = require('fs')
import { IMessage } from '../utils';

export const VerifyGame = (connection: any, message: IMessage, filename: string): boolean => {
  if (process.env.NODE_ENV == "development") {
    if ((message.type == "join_player" || message.type == "retrieve_game") && !fs.existsSync(filename)) {
      connection.sendUTF(JSON.stringify({ error: "This game doesn't exist." }));
      return false;
    }
    if (message.type == "create_player" && fs.existsSync(filename)) {
      connection.sendUTF(JSON.stringify({ error: "This game already exists." }));
      return false;
    }
    if (message.type == "create_player") {
      fs.mkdir('data/history/' + message.game_id, () => {})
    }
  }
  return true;
}