import React from 'react'
import './ErrorMessage.scss'

export const ErrorMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  title,
  ...rest
}) => (
  <div className='ErrorMessage' {...rest}>
    <i className='ErrorMessage-icon icono-exclamationCircle' />
    {title && <h2 className='ErrorMessage-title'>{title}</h2>}
    <div className='ErrorMessage-content'>{children}</div>
  </div>
)
