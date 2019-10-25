import React from 'react'
import { Statuses } from './Statuses'
import { AppState } from '../../interfaces'
import { ErrorMessage } from './ErrorMessage'
import { GearIconButton } from './IconButton'
import { Body } from './Text'
import './Checkup.scss'

export interface CheckupProps {
  onConfigure: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  state: {
    main: AppState | null
  }
}

export const Checkup: React.FC<CheckupProps> = ({ onConfigure, state }) => (
  <div className='checkup'>
    <main className='checkup-content'>
      {state.main && state.main.state === 'OK' ? (
        <Statuses jobs={state.main ? Object.values(state.main.jobs) : []} />
      ) : (
        <ErrorMessage title='Bad config'>
          <Body>
            Bad configuration file detected:{' '}
            {state.main!.errorMessage || 'unknown error'}
          </Body>
        </ErrorMessage>
      )}
    </main>
    <nav className='checkup-controls'>
      <GearIconButton onClick={onConfigure} title='Configure' />
    </nav>
  </div>
)
