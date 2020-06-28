import React, { useState, useEffect, FC } from "react";

interface ICountdownTimerProps {
  seconds: number,
  onComplete: () => void
}

export const CountdownTimer: FC<ICountdownTimerProps> = ({ seconds, onComplete }) => {
  const initial = seconds * 1000
  const [remaining, setRemaining] = useState<number>(initial)
  const decrement = 100

  useEffect(() => {
    let timer = setTimeout(() => {
      if (remaining <= 0) {
        clearTimeout(timer)
        onComplete()
        return
      }
      setRemaining(Math.max(remaining - decrement, 0))
    }, decrement)
    return () => clearTimeout(timer)
  }, [remaining])

  return (
    <div className="countdown">
      <span style={{ width: `${(remaining / initial * 100).toFixed(2)}%` }}></span>
    </div>
  )
}