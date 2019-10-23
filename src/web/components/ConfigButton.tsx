import React from 'react'
import './ConfigButton.scss'

export const ConfigButton: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = props => (
  <div className='config row' {...props}>
    <i className='icono-gear' />
    <span className='caption'>Configure</span>
  </div>
)
