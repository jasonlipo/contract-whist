import { IMessage, log } from '../utils';

export const CreateJoinPlayer = async (db: any, connection: any, message: IMessage): Promise<boolean> => {
  const mode = db.get('shared.mode')
  if (mode == 'players_joining') {
    let players = db.get('shared.players')
    if (players.size() == 5) {
      connection.sendUTF(JSON.stringify({ error: "There are already 5 players in this game." }));
      return false;
    }
    else {
      let admin_player = players.size() == 0
      if (admin_player) {
        await log(db, message, "created the game")
      }
      else {
        await log(db, message, "joined the game")
      }
      await players.push(message.value).write()
      await db.set(['shared', 'points_history', message.value], []).write()
      await db.set(['private', message.user_id], {
        player_index: players.size() - 1,
        user_id: message.user_id,
        name: message.value,
        admin: admin_player,
        entered_game: true
      }).write()
    }
  }
  else {
    connection.sendUTF(JSON.stringify({ error: "You cannot join a game that's already started." }));
    return false;
  }
  return true;
}