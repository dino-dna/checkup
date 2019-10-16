import React from 'react'
import ReactDOM from 'react-dom'

ReactDOM.render(
  <div>
    <h1>Statuses</h1>
    <ol>
      <li>thing one | OK | subtle - updated last</li>
      <li>thing two | NOT OK | subtle - tried last</li>
      <li>thing three | PENDING | subtle - updated last</li>
    </ol>
    <div>
      <span>ICON to configure scripts</span>
    </div>
  </div>,
  document.getElementById('app')
)
