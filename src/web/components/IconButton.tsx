import { FunctionComponent, JSX, h } from 'preact'
import clsx from 'clsx'
import './IconButton.scss'

export type IconButtonProps = JSX.HTMLAttributes

export const IconButton: FunctionComponent<IconButtonProps> = ({
  className,
  ...rest
}) => <button className={clsx('IconButton', className)} {...rest} />

export const GearIconButton: FunctionComponent<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-gear' />
  </IconButton>
)

export const IssueIconButton: FunctionComponent<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-exclamationCircle' />
  </IconButton>
)

export const FileIconButton: FunctionComponent<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-file' />
  </IconButton>
)
