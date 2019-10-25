import React from 'react'
import { Heading } from './Text'
import './ErrorMessage.scss'

export const ErrorMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  title,
  ...rest
}) => (
  <div className='ErrorMessage' {...rest}>
    <i className='ErrorMessage-icon icono-exclamationCircle' />
    {title && <Heading>{title}</Heading>}
    <div className='ErrorMessage-content'>{children}</div>
  </div>
)
