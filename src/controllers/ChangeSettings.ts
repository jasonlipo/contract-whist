import { log, IMessage, ELogAction } from '../utils';

export const ChangeSettings = async (db: any, message: IMessage): Promise<boolean> => {
  const values = Object.keys(message.value).map(async (key) => {
    await db.set(['shared', key], message.value[key]).write()
  })
  await Promise.all(values)
  await log(db, message.player_index, ELogAction.CHANGE_SETTINGS)
  return true;
}
