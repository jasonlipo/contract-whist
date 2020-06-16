import { IMessage, log } from './utils';
import _ from 'lodash';

export const PlayCard = (db: any, message: IMessage ): boolean => {
  let new_hand = db.get(['private', message.user_id, 'hand']).value()
  let dealt_card = new_hand.splice(message.value, 1)

  // Verify dealt card is correct
  if (dealt_card != message.card_id) return false;

  // Verify that you are in play
  if (db.get('shared.mode').value() != "play" || db.get('shared.in_play').value() != message.player_index) return false;

  db.set(['private', message.user_id, 'hand'], new_hand)
    .set('shared.in_play', (message.player_index + 1) % db.get('shared.players').size())
    .set(['shared', 'table', message.player_index], dealt_card[0]).write()
  log(db, message, "played a card")

  if (db.get('shared.table').value().filter(x => x == null).length == 0) {
    // End of trick
    db.set('shared.mode', 'end_of_trick').write()
    const table = db.get('shared.table').value()
    const trump_suit = db.get('shared.trump_suit').value()
    if (trump_suit != "no_trump") {
      const find_trump = table.filter(card => card.substr(0, 1) == trump_suit)
      if (find_trump.length > 0) {
        const winning_card = _.max(find_trump.map(card => parseInt(card.substr(1))))
        const winning_player_index = table.indexOf(trump_suit + winning_card.toString())
        const new_trick_wins = db.get(['shared', 'tricks_won', winning_player_index]).value() + 1
        db.set('shared.in_play', winning_player_index)
          .set(['shared', 'tricks_won', winning_player_index], new_trick_wins)
          .write()
          log(db, { name: db.get('shared.players').value()[winning_player_index] }, "won the trick")
        return true;
      }
    }
    const leading_suit = table[db.get('shared.player_lead_trick').value()].substr(0, 1)
    const find_leading_suit = table.filter(card => card.substr(0, 1) == leading_suit)
    const winning_card = _.max(find_leading_suit.map(card => parseInt(card.substr(1))))
    const winning_player_index = table.indexOf(leading_suit + winning_card.toString())
    const new_trick_wins = db.get(['shared', 'tricks_won', winning_player_index]).value() + 1
    db.set('shared.in_play', winning_player_index)
      .set(['shared', 'tricks_won', winning_player_index], new_trick_wins)
      .write()
    log(db, { name: db.get('shared.players').value()[winning_player_index] }, "won the trick")
  }
  return true;
}