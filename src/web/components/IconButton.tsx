import React from 'react'
import clsx from 'clsx'
import './IconButton.scss'

export type IconButtonProps = React.HTMLAttributes<HTMLButtonElement>

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  ...rest
}) => <button className={clsx('IconButton', className)} {...rest} />

export const GearIconButton: React.FC<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-gear' />
  </IconButton>
)

export const IssueIconButton: React.FC<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-exclamationCircle' />
  </IconButton>
)

export const FileIconButton: React.FC<IconButtonProps> = props => (
  <IconButton {...props}>
    <i className='icono-file' />
  </IconButton>
)
