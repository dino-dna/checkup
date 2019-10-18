import React from 'react'
import ReactDOM from 'react-dom'
import { Statuses } from './Statuses'
import './icons.min.css'
import './app.scss'
import * as configure from '../configure'

const onConfigure = () => {
  const conf: typeof configure = window
    .require('electron')
    .remote.require('./configure')
  const editP = (conf as any).edit(() => console.log('qwfppppp'))
  console.log('arst', editP)
  editP.then(() => console.log('jamon'))
}

ReactDOM.render(
  <div>
    <h1>Statuses</h1>
    <Statuses results={[]} />
    <div className='config row' onClick={onConfigure}>
      <i className='icono-gear' />
      <span className='caption'>Configure</span>
    </div>
  </div>,
  document.getElementById('app')
)

function enableInspectMenu () {
  const remote = require('remote')
  const Menu = remote.require('menu')
  const MenuItem = remote.require('menu-item')
  let rightClickPosition: { x: number; y: number } | null = null
  const menu = new Menu()
  const menuItem = new MenuItem({
    label: 'Inspect Element',
    click: () => {
      remote
        .getCurrentWindow()
        .inspectElement(rightClickPosition!.x, rightClickPosition!.y)
    }
  })
  menu.append(menuItem)
  window.addEventListener(
    'contextmenu',
    e => {
      e.preventDefault()
      rightClickPosition = { x: e.x, y: e.y }
      menu.popup(remote.getCurrentWindow())
    },
    false
  )
}

enableInspectMenu()
