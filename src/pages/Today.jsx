import React, { useState } from 'react'
import { useStore } from '../store'
import { THEMES, DEFAULT_THEME } from '../themes'

const WEEKDAYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

const AFFIRMATIONS = [
  "you're doing amazing sweetie ✨",
  "every step forward counts ♡",
  "be kind to yourself today",
  "you got this! 🌸",
  "small progress is still progress",
  "today is full of possibilities",
  "you are enough, always",
  "shine bright like a star ✧",
  "take it one task at a time",
  "you're capable of wonderful things",
  "breathe, you've got this",
  "beautiful things take time",
  "you're exactly where you need to be",
  "trust the process ♡",
  "radiate good vibes ✿",
  "you're a masterpiece in progress",
  "soft days are productive too",
  "bloom at your own pace 🌷",
  "you make the world prettier",
  "starlight, you belong here",
]

const MOODS = [
  { emoji: '🌻', label: 'sunny' },
  { emoji: '☁️', label: 'cloudy' },
  { emoji: '🌧️', label: 'rainy' },
  { emoji: '🌸', label: 'blooming' },
  { emoji: '✨', label: 'sparkly' },
  { emoji: '😴', label: 'tired' },
  { emoji: '💪', label: 'motivated' },
  { emoji: '🦋', label: 'butterflies' },
]

const PRIORITY_ICONS = { low: '💫', medium: '⭐', high: '🌟' }

function dayOfYear() {
  const now = new Date()
  const start = new Date(now.getFullYear(), 0, 0)
  const diff = now - start
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

function ProgressRing({ done, total, color }) {
  const r = 36
  const circ = 2 * Math.PI * r
  const pct = total > 0 ? done / total : 0
  return (
    <div className="progress-ring">
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--progress-bg)" strokeWidth="6" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="progress-ring-text">
        <span className="progress-ring-pct">{Math.round(pct * 100)}%</span>
        <span className="progress-ring-label">done</span>
      </div>
    </div>
  )
}

export default function Today() {
  const { habits, notes, moods, toggleEntry, getStreak, saveNote, saveMood, today, theme } = useStore()
  const accent = (THEMES[theme] || THEMES[DEFAULT_THEME]).vars['--pink']
  const todayKey = today()
  const d = new Date()
  const weekday = WEEKDAYS[d.getDay()]
  const month = MONTHS[d.getMonth()]
  const day = d.getDate()
  const doneCount = habits.filter(h => h.entries[todayKey]).length
  const affirmation = AFFIRMATIONS[dayOfYear() % AFFIRMATIONS.length]
  const currentMood = moods[todayKey] || null
  const currentNote = notes[todayKey] || ''
  const [noteText, setNoteText] = useState(currentNote)
  const [noteSaved, setNoteSaved] = useState(true)

  function handleNoteChange(text) {
    setNoteText(text)
    setNoteSaved(false)
  }

  function handleSaveNote() {
    saveNote(todayKey, noteText)
    setNoteSaved(true)
  }

  const totalTasks = habits.length

  return (
    <div className="page">
      <div className="sparkle sparkle-1">✧</div>
      <div className="sparkle sparkle-2">✦</div>
      <div className="sparkle sparkle-3">✿</div>
      <div className="sparkle sparkle-4">♡</div>

      <div className="affirmation">{affirmation}</div>

      <div className="date-header">
        <span className="date-weekday">{weekday}</span>
        <span className="date-day">{month} {day}</span>
        {totalTasks > 0 && (
          <ProgressRing done={doneCount} total={totalTasks} color={accent} />
        )}
      </div>

      <div className="mood-section">
        <span className="mood-label">how are you feeling?</span>
        <div className="mood-options">
          {MOODS.map(m => (
            <button
              key={m.label}
              className={`mood-btn ${currentMood === m.label ? 'active' : ''}`}
              onClick={() => saveMood(todayKey, currentMood === m.label ? null : m.label)}
              title={m.label}
            >
              {m.emoji}
            </button>
          ))}
        </div>
      </div>

      {totalTasks === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✿</div>
          <p>nothing to do today!</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map(h => {
            const done = !!h.entries[todayKey]
            const streak = getStreak(h)
            const icon = PRIORITY_ICONS[h.priority] || '⭐'
            return (
              <div
                key={h.id}
                className={`habit-card ${done ? 'done' : ''}`}
                onClick={() => toggleEntry(h.id, todayKey)}
              >
                <div className="habit-check" style={{ borderColor: h.color, background: done ? h.color : 'transparent' }}>
                  {done && <span className="check-mark">✓</span>}
                </div>
                <div className="habit-info">
                  <span className="habit-name" style={{ textDecoration: done ? 'line-through' : 'none' }}>
                    <span className="priority-icon">{icon}</span>
                    {h.name}
                  </span>
                  {h.description && <span className="habit-desc">{h.description}</span>}
                </div>
                <div className="habit-streak-mini" style={{ color: h.color }}>
                  ♡ {streak}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="notes-section">
        <span className="notes-label">daily note ✎</span>
        <textarea
          className="notes-input"
          placeholder="write something..."
          value={noteText}
          onChange={e => handleNoteChange(e.target.value)}
          rows={3}
        />
        {!noteSaved && (
          <button className="btn save-note-btn" onClick={handleSaveNote}>save note</button>
        )}
      </div>
    </div>
  )
}
