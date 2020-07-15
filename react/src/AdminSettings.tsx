import React, { useState, FC } from 'react';
import { IPlayerPosition, IScoringMethod } from './ContractWhist';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Switch from 'react-input-switch';

interface IAdminSettingsProps {
  players: string[],
  player_index: IPlayerPosition,
  enable_timer: boolean,
  timer_seconds: number,
  scoring_method: IScoringMethod,
  show_other_bids: boolean,
  show_other_tricks_won: boolean,
  double_points_no_trumps: boolean
  onClose: () => void
}

const positiveInteger = (str: string): number => {
  if (isNaN(parseInt(str)) || parseInt(str) < 0) {
    return 0
  }
  return parseInt(str)
}

const switchValue = (bool: boolean): number => bool ? 1 : 0

export const AdminSettings: FC<IAdminSettingsProps> = ({ enable_timer, timer_seconds, scoring_method, onClose, show_other_bids, show_other_tricks_won, double_points_no_trumps }) => {
  const [enableTimerLocal, setEnableTimerLocal] = useState<boolean>(enable_timer)
  const [timerSecondsLocal, setTimerSecondsLocal] = useState<number>(timer_seconds)
  const [scoringMethodLocal, setScoringMethodLocal] = useState<IScoringMethod>(scoring_method)
  const [showOtherBidsLocal, setShowOtherBidsLocal] = useState<boolean>(show_other_bids)
  const [showOtherTricksWonLocal, setShowOtherTricksWonLocal] = useState<boolean>(show_other_tricks_won)
  const [doublePointsNoTrumpsLocal, setDoublePointsNoTrumpsLocal] = useState<boolean>(double_points_no_trumps)

  const toggleScoring = () => setScoringMethodLocal(scoringMethodLocal == 'fixed' ? 'variable' : 'fixed')
  const style = { container: { height: 6, width: 32 }, button: { right: 18 }, buttonChecked: { left: 18 } }

  return (
    <>
      <div className="admin-settings-bg"></div>
      <div className="admin-settings">
        <div className="admin-settings-title">
          Game Settings
          <FontAwesomeIcon icon={faTimes} onClick={onClose} />
        </div>
        <div className="admin-settings-content">
          <div className="admin-settings-item">
            Enable time limit for players
            <Switch value={switchValue(enableTimerLocal)} onChange={(value: number) => setEnableTimerLocal(value === 1)} styles={style} />
          </div>
          {
            enableTimerLocal &&
            <div className="admin-settings-item">
              Time limit (in seconds)
              <input type="text" value={timerSecondsLocal.toString()} onChange={e => setTimerSecondsLocal(positiveInteger(e.target.value))} />
            </div>
          }
          <div className="admin-settings-item">
            Fixed scoring<br />(10 points + bid)
            <Switch value={switchValue(scoringMethodLocal == 'fixed')} onChange={toggleScoring} styles={style} />
          </div>
          <div className="admin-settings-item">
            Variable scoring<br />(points depend on no. of cards)
            <Switch value={switchValue(scoringMethodLocal == 'variable')} onChange={toggleScoring} styles={style} />
          </div>
          <div className="admin-settings-item">
            Double points for a<br />"No Trump Suit" round
            <Switch value={switchValue(doublePointsNoTrumpsLocal)} onChange={(value: number) => setDoublePointsNoTrumpsLocal(value === 1)} styles={style} />
          </div>
          <div className="admin-settings-item">
            Show bids for other players
            <Switch value={switchValue(showOtherBidsLocal)} onChange={(value: number) => setShowOtherBidsLocal(value === 1)} styles={style} />
          </div>
          <div className="admin-settings-item">
            Show tricks won by other players
            <Switch value={switchValue(showOtherTricksWonLocal)} onChange={(value: number) => setShowOtherTricksWonLocal(value === 1)} styles={style} />
          </div>
        </div>
        <div className="admin-settings-save">
          <button>
            Save
          </button>
        </div>
      </div>
    </>
  )
}
