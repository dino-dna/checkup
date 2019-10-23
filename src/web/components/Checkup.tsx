import React from 'react'
import { Statuses } from './Statuses'
import { AppState } from '../../interfaces'
import { ConfigButton } from './ConfigButton'
import { ErrorMessage } from './ErrorMessage'
import './Checkup.scss'

export interface CheckupProps {
  onConfigure: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => any
  state: {
    main: AppState | null
  }
}

export const Checkup: React.FC<CheckupProps> = ({ onConfigure, state }) => (
  <div id='checkup'>
    <h4 style={{ borderTop: 'none' }}>Statuses</h4>
    {state.main && state.main.state === 'OK' ? (
      <Statuses jobs={state.main ? Object.values(state.main.jobs) : []} />
    ) : (
      <ErrorMessage>{state.main!.errorMessage || 'unknown error'}</ErrorMessage>
    )}
    <div style={{ flexGrow: 1 }} />
    <ConfigButton onClick={onConfigure} />
  </div>
)
