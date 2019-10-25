import React from 'react'
import { Body } from './Text'
import './ConfigButton.scss'

export const ConfigButton: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = props => (
  <div className='config row' {...props}>
    <i className='icono-gear' />
    <Body className='caption'>Configure</Body>
  </div>
)
