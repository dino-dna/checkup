import { FunctionComponent, JSX, h } from 'preact'
import { Statuses } from './Statuses'
import { AppState } from '../../interfaces'
import { ErrorMessage } from './ErrorMessage'
import { GearIconButton, IssueIconButton, FileIconButton } from './IconButton'
import { Body } from './Text'
import './Checkup.scss'

export interface CheckupProps {
  onConfigure: JSX.MouseEventHandler
  onIssue: JSX.MouseEventHandler
  onOpenLog: JSX.MouseEventHandler
  state: {
    main: AppState | null
  }
}

export const Checkup: FunctionComponent<CheckupProps> = ({
  onConfigure,
  onIssue,
  onOpenLog,
  state
}) => (
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
      <IssueIconButton onClick={onIssue} title='Open an issue' />
      <div className='checkup-controls-spacer' />
      <FileIconButton onClick={onOpenLog} title='Open log file' />
      <GearIconButton onClick={onConfigure} title='Configure' />
    </nav>
  </div>
)
