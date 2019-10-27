import React, { useReducer } from 'react'
import clsx from 'clsx'
import { Statuses } from './Statuses'
import { AppState } from '../../interfaces'
import { ErrorMessage } from './ErrorMessage'
import {
  GearIconButton,
  IssueIconButton,
  FileIconButton,
  ThemeIconButton
} from './IconButton'
import { Body } from './Text'
import { initialState, rootReducer } from '../reducers'
import './Checkup.scss'
import { Themes } from '../reducers/theme'

export interface CheckupProps {
  onConfigure: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  onIssue: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  onOpenLog: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  state: {
    main: AppState | null
  }
}

export const Checkup: React.FC<CheckupProps> = ({
  onConfigure,
  onIssue,
  onOpenLog,
  state: { main }
}) => {
  const [state, dispatch] = useReducer(rootReducer, initialState)

  return (
    <div
      className={clsx('checkup', {
        'checkup-dark': state.theme.value === Themes.Dark
      })}
    >
      <main className='checkup-content'>
        {main && main.state === 'OK' ? (
          <Statuses jobs={main ? Object.values(main.jobs) : []} />
        ) : (
          <ErrorMessage title='Bad config'>
            <Body>
              Bad configuration file detected:{' '}
              {main!.errorMessage || 'unknown error'}
            </Body>
          </ErrorMessage>
        )}
      </main>
      <nav className='checkup-controls'>
        <IssueIconButton onClick={onIssue} title='Open an issue' />
        <div className='checkup-controls-spacer' />
        <ThemeIconButton
          onClick={() =>
            dispatch({
              payload: null,
              type: 'TOGGLE_THEME'
            })}
          theme={state.theme.value}
          title='Change theme'
        />
        <FileIconButton onClick={onOpenLog} title='Open log file' />
        <GearIconButton onClick={onConfigure} title='Configure' />
      </nav>
    </div>
  )
}
