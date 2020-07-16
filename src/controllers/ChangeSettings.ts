import { log, IMessage, ELogAction } from '../utils';

export const ChangeSettings = async (db: any, message: IMessage): Promise<boolean> => {
  const values = Object.keys(message.value).map(async (key) => {
    if (key == "admin_player") {
      let users = db.get('private').value()
      Object.keys(users).forEach(key => {
        users[key].admin = (users[key].player_index == message.value['admin_player'])
      })
      await db.set('private', users).write()
    }
    else {
      await db.set(['shared', key], message.value[key]).write()
    }
  })
  await Promise.all(values)
  await log(db, message.player_index, ELogAction.CHANGE_SETTINGS)
  return true;
}
