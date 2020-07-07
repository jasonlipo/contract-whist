import { IMessage, log, ELogAction } from '../utils';

export const CreateJoinPlayer = async (db: any, connection: any, message: IMessage): Promise<boolean> => {
  const mode = db.get('shared.mode')
  if (mode == 'players_joining') {
    let players = db.get('shared.players')
    const new_player_index = players.size().value()
    if (new_player_index == 5) {
      connection.sendUTF(JSON.stringify({ error: "There are already 5 players in this game." }));
      return false;
    }
    else if (players.value().indexOf(message.value) > -1) {
      connection.sendUTF(JSON.stringify({ error: "Someone in the game already has this name" }));
      return false;
    }
    else {
      let admin_player = new_player_index == 0
      if (admin_player) {
        await log(db, new_player_index, ELogAction.CREATE_GAME)
      }
      else {
        await log(db, new_player_index, ELogAction.JOIN_GAME)
      }
      await players.push(message.value).write()
      await db.set(['private', message.user_id], {
        player_index: new_player_index,
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