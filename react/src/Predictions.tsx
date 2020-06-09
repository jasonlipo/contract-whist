import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';
import _ from 'lodash';

interface IPredictionsProps extends IContractWhistState {
  onSubmitPrediction(x: number): void
}

export const Predictions: FC<IPredictionsProps> = ({ player_index, in_play, onSubmitPrediction, predictions, cards_per_hand, players }) => {
  const sumOfPreviousPredictions = _.sum(predictions)
  const [prediction, setPrediction] = useState<number>(null)
  const last_player_to_predict = predictions.length == players.length - 1

  return (
    <div className="predictions">
      {
        player_index == in_play ?
        <>
          <label>Enter the number of tricks you think you will win</label>
          <br />
          <input value={prediction} onChange={(e) => setPrediction(isNaN(parseInt(e.target.value)) ? null : parseInt(e.target.value))} />
          <br />
          {
            (prediction !== null && prediction <= cards_per_hand &&
              (!last_player_to_predict || (last_player_to_predict && (sumOfPreviousPredictions + prediction != cards_per_hand)))
            )
            ? <button onClick={() => onSubmitPrediction(prediction)}>Submit</button>
            : <div>Your prediction is invalid.</div>
          }
        </>
        :
        <span>{players[in_play]} is currently predicting their expected number of tricks</span>
      }
    </div>
  )
}