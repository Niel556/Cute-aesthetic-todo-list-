import React, { useState } from 'react'
import { useStore } from '../store'
import { THEMES, THEME_KEYS } from '../themes'

export default function TitleBar() {
  const { theme, setTheme } = useStore()
  const [open, setOpen] = useState(false)

  return (
    <div className="titlebar">
      <span className="titlebar-title">coquette</span>
      <span className="titlebar-sub">to-do list</span>
      <div className="theme-selector">
        <button className="theme-toggle" onClick={() => setOpen(o => !o)}>
          {THEMES[theme]?.icon || '♡'}
        </button>
        {open && (
          <div className="theme-dropdown">
            {THEME_KEYS.map(key => (
              <button
                key={key}
                className={`theme-option ${key === theme ? 'active' : ''}`}
                onClick={() => { setTheme(key); setOpen(false) }}
              >
                <span className="theme-option-icon">{THEMES[key].icon}</span>
                <span className="theme-option-name">{THEMES[key].name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
