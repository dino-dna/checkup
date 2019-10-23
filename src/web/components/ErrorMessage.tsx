import React from 'react'

export const ErrorMessage: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  ...rest
}) => (
  <div className='ErrorMessage' {...rest}>
    <h2>Bad config</h2>
    <p>Bad configuration file detected</p>
    {!!children && <p>{children}</p>}
  </div>
)
