import React, { useState, FC } from 'react';
import { IContractWhistState } from './ContractWhist';

interface IPredictionsProps extends IContractWhistState {
  onSubmitPrediction(x: number): void
}

export const Predictions: FC<IPredictionsProps> = ({ name, in_play, onSubmitPrediction }) => {
  const [prediction, setPrediction] = useState<number>(null)

  return (
    <div className="predictions">
      {
        name == in_play ?
        <>
          <label>Enter the number of tricks you think you will win</label>
          <br />
          <input value={prediction} onChange={(e) => setPrediction(parseInt(e.target.value))} />
          <br />
          <button onClick={() => onSubmitPrediction(prediction)}>Submit</button>
        </>
        :
        <span>{in_play} is currently predicting their expected number of tricks</span>
      }
    </div>
  )
}