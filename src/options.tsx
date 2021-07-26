import React, { FC, useEffect, useState } from 'react'
import { useMedia } from 'react-use'

const availableThemes = ['light', 'dark'] as const

const useTheme = () => {
  const preferDark = useMedia('(prefers-color-scheme:dark)')
  const [theme, _setTheme] = useState<typeof availableThemes[number]>()
  const [ready, setReady] = useState(false)

  const setTheme = (v: any) => {
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
    document.documentElement.setAttribute(
      'class',
      'theme-' + (theme ?? (preferDark ? 'dark' : 'light'))
    )
  }, [preferDark, theme])

  return {
    ready,
    theme,
    setTheme,
  }
}

export const Options: FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div
      style={{
        position: 'fixed',
        top: 2,
        right: 10,
        userSelect: 'none',
      }}
    >
      Theme:{'  '}
      <select
        value={theme ?? 'system'}
        onChange={(e) => {
          setTheme(e.target.value)
        }}
      >
        <option key="">system</option>
        {availableThemes.map((v) => (
          <option key={v}>{v}</option>
        ))}
      </select>
    </div>
  )
}

export default Options
