import React from 'react'
import { Statuses } from './Statuses'
import { AppState } from '../../interfaces'
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
      <>
        <h2>Bad config</h2>
        <p>
          Bad configuration file detected{' '}
          {state.main!.errorMessage || 'unknown error'}
        </p>
      </>
    )}
    <div style={{ flexGrow: 1 }} />
    <div className='config row' onClick={onConfigure}>
      <i className='icono-gear' />
      <span className='caption'>Configure</span>
    </div>
  </div>
)
