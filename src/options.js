import React from 'react'
import { themes } from './constants'

const Options = props => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      marginRight: 10,
      marginTop: 2,
    }}
    onChange={e => {
      props.changeTheme(e.target.value)
    }}
  >
    Theme:{'  '}
    {themes.map(item => (
      <label key={item} style={{ marginRight: 4 }}>
        <input
          type="radio"
          name="theme"
          value={item}
          defaultChecked={props.theme === item}
        />
        {item}
      </label>
    ))}
  </div>
)

export default Options
