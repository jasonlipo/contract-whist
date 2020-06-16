import { IMessage } from './utils';
const fs = require('fs')
const moment = require('moment')

export const BroadcastResponse = (db: any, clients: any, controller_action: boolean, filename: string, message: IMessage, s3client: any) => {
  const historical_file = 'data/history/' + message.game_id + '/' + moment().format('YYYY_MM_DD_HH_mm_ss') + '.json'
  if (process.env.NODE_ENV == "development") {
    fs.copyFile(filename, historical_file, () => {})
  }
  else {
    s3client.s3.copyObject({
      Bucket: "contract-whist-lowdb",
      CopySource: filename,
      Key: historical_file
    }, () => {})
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