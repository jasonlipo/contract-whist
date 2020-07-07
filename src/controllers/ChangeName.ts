import { fetch_players, log, IMessage, ELogAction } from '../utils';

export const ChangeName = async (db: any, message: IMessage): Promise<boolean> => {
  const all_players = fetch_players(db)
  if (all_players.indexOf(message.value) == -1) {
    await db.set(['private', message.user_id, 'name'], message.value).write()
    const new_players = all_players.map((p, i) => {
      if (i == message.player_index) {
        return message.value
      }
      return p
    })
    await db.set('shared.players', new_players).write()
    await log(db, message.player_index, ELogAction.RENAME_PLAYER, message.value)
  }
  return true;
}
