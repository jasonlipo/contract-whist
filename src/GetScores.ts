import _ from 'lodash';
export const GetScores = (db: any): boolean => {
  let new_points = db.get('shared.points').value()
  let predictions = db.get('shared.predictions').value()
  let tricks_won = db.get('shared.tricks_won').value()
  let cards_per_hand = db.get('shared.cards_per_hand').value()
  new_points = new_points.map((current_points, player_index) => {
    let prediction = predictions[player_index]
    let tricks = tricks_won[player_index]
    if (prediction == tricks) {
      if (prediction == 0) {
        let sum_of_predictions = _.sum(predictions)
        let rounding
        if (sum_of_predictions > cards_per_hand) {
          rounding = Math.floor(cards_per_hand / 2)
        }
        else {
          rounding = Math.ceil(cards_per_hand / 2)
        }
        return current_points + rounding
      }
      return current_points + cards_per_hand + prediction
    }
    else {
      return current_points - Math.abs(prediction - tricks)
    }
  })
  db.set('shared.mode', 'scores')
    .set('shared.points', new_points)
    .set('shared.table', [])
    .set('shared.in_play', null)
    .write()
  return true;
}