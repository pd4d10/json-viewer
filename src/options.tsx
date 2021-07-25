import React, { FC } from 'react'
import { themes } from './constants'

// export interface OptionsProps {}

export const Options: FC<{
  theme: 'light' | 'dark'
  changeTheme(value: string): void
}> = (props) => (
  <div
    style={{
      position: 'fixed',
      top: 0,
      right: 0,
      marginRight: 10,
      marginTop: 2,
    }}
    onChange={(e) => {
      props.changeTheme(e.target.value)
    }}
  >
    Theme:{'  '}
    {themes.map((item) => (
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
