import React from 'react'

const tabs = [
  { key: 'today', label: 'today', icon: '♡' },
  { key: 'tasks', label: 'tasks', icon: '✦' },
  { key: 'stats', label: 'stats', icon: '✧' },
]

export default function Navbar({ active, onChange }) {
  return (
    <nav className="navbar">
      {tabs.map(t => (
        <button
          key={t.key}
          className={`navbar-btn ${active === t.key ? 'active' : ''}`}
          onClick={() => onChange(t.key)}
        >
          <span className="navbar-icon">{t.icon}</span>
          <span className="navbar-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
