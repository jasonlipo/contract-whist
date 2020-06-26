const WebSocketServer = require('websocket').server;
import { IMessage, initialise, generate_db } from './utils';
import { CreateJoinPlayer, StartGame, SubmitBid, SubmitTrump, PlayCard,
         NextTrick, GetScores, NextRound, VerifyGame, BroadcastResponse} from './controllers';

export const websocket_server = (http: any, clients: any, deck: any) => {
  const wss = new WebSocketServer({ httpServer: http });
  wss.on('request', ws => {
    const connection = ws.accept(null, ws.origin);
    connection.on('message', async (raw) => {
      try {
        let controller_action: boolean = true;
        let message: IMessage = JSON.parse(raw.utf8Data)
        controller_action = await VerifyGame(connection, message, message.game_id)
        if (!controller_action) return;

        let db = await generate_db(message.game_id)

        await initialise(db, message)
        clients[message.user_id] = connection

        switch (message.type) {
          case "create_player": case "join_player": controller_action = await CreateJoinPlayer(db, connection, message); break;
          case "start_game": controller_action = await StartGame(db, message, deck); break;
          case "submit_bid": controller_action = await SubmitBid(db, message, deck); break;
          case "submit_trump": controller_action = await SubmitTrump(db, message); break;
          case "play_card": controller_action = await PlayCard(db, message); break;
          case "next_trick": controller_action = await NextTrick(db); break;
          case "get_scores": controller_action = await GetScores(db); break;
          case "next_round": controller_action = await NextRound(db, message, deck);break;
        }

        await BroadcastResponse(db, clients, controller_action, message)
      }
      catch (e) {
        console.error('Error: ' + e)
      }
    });
  });
}