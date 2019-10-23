import React from 'react'
import './ErrorMessage.scss'

export const ErrorMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => (
  <div className='ErrorMessage' {...rest}>
    <i className='ErrorMessage-icon icono-exclamationCircle' />
    <h2 className='ErrorMessage-title'>Bad config</h2>
    <div className='ErrorMessage-content'>
      <p>Bad configuration file detected</p>
      {!!children && <p>{children}</p>}
    </div>
  </div>
)
