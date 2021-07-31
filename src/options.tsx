import React, { FC, useEffect, useState } from 'react'
import { useMedia } from 'react-use'

const availableThemes = ['light', 'dark'] as const

const useTheme = () => {
  const preferDark = useMedia('(prefers-color-scheme:dark)')
  const [userTheme, _setTheme] = useState<typeof availableThemes[number]>()
  const [ready, setReady] = useState(false)

  const setUserTheme = (v: any) => {
    console.log('set theme', v)
    if (availableThemes.includes(v)) {
      _setTheme(v)
      chrome.storage.sync.set({ theme: v })
    } else {
      _setTheme(undefined)
      chrome.storage.sync.remove('theme')
    }
  }

  useEffect(() => {
    chrome.storage.sync.get('theme', ({ theme: v }) => {
      console.log('load theme', v)
      if (availableThemes.includes(v)) {
        _setTheme(v)
      }
      setReady(true)
    })
  }, [])

  useEffect(() => {
    const value = userTheme ?? (preferDark ? 'dark' : 'light')
    document.documentElement.setAttribute('class', 'theme-' + value)
    document.documentElement.style.setProperty('color-scheme', value) // for scrollbar
  }, [preferDark, userTheme])

  return {
    ready,
    userTheme,
    setUserTheme,
  }
}

export const Options: FC = () => {
  const { userTheme, setUserTheme } = useTheme()

  return (
    <div
      style={{
        position: 'fixed',
        top: 2,
        right: 10,
        userSelect: 'none',
      }}
    >
      Theme:&nbsp;&nbsp;
      <select
        value={userTheme ?? 'system'}
        onChange={(e) => {
          setUserTheme(e.target.value)
        }}
      >
        <option key="">system</option>
        {availableThemes.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <a href="https://github.com/pd4d10/json-viewer" target="_blank">
        Source Code
      </a>
    </div>
  )
}

export default Options
