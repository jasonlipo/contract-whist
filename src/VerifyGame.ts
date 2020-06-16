const fs = require('fs')
import { IMessage } from './utils';

const file_exists = (filename: string, s3client: any): Promise<boolean> => {
  if (process.env.NODE_ENV == "development") {
    return Promise.resolve(fs.existsSync(filename))
  }
  else {
    return new Promise((resolve, _reject) => {
      s3client.headObject({ Bucket: "contract-whist-lowdb", Key: filename }, function (err, data) {
        if (err) {
          resolve(false)
        }
        else {
          resolve(true)
        }
      })
    })
  }
}

const create_directory = (path: string): void => {
  if (process.env.NODE_ENV == "development") {
    fs.mkdir(path, () => {})
  }
}

export const VerifyGame = async (connection: any, message: IMessage, filename: string, s3client: any): Promise<boolean> => {
  const exists = await file_exists(filename, s3client)
  if ((message.type == "join_player" || message.type == "retrieve_game") && !exists) {
    connection.sendUTF(JSON.stringify({ error: "This game doesn't exist." }));
    return false;
  }
  if (message.type == "create_player" && exists) {
    connection.sendUTF(JSON.stringify({ error: "This game already exists." }));
    return false;
  }
  if (message.type == "create_player") {
    create_directory('data/history/' + message.game_id)
  }
  return true;
}