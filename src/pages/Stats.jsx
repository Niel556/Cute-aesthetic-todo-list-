import React, { useState } from 'react'
import { useStore } from '../store'
import { THEMES, DEFAULT_THEME } from '../themes'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function CalendarHeatmap({ entries, color }) {
  const today = new Date()
  const days = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    days.push({ key, day: d.getDate(), done: !!entries[key] })
  }

  return (
    <div className="heatmap">
      {days.map(d => (
        <div
          key={d.key}
          className={`heatmap-cell ${d.done ? 'done' : ''}`}
          style={d.done ? { backgroundColor: color } : {}}
          title={d.key}
        />
      ))}
    </div>
  )
}

function MonthChart({ entries, color, colors }) {
  const today = new Date()
  const data = []
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    data.push({ date: label, done: entries[key] ? 1 : 0 })
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: colors.tick }} interval={4} />
        <YAxis hide domain={[0, 1]} />
        <Tooltip
          contentStyle={{ background: colors.tooltipBg, border: `1px solid ${colors.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
          formatter={(v) => [v ? 'done ♡' : 'missed', 'status']}
        />
        <Bar dataKey="done" fill={color} radius={[6, 6, 0, 0]} maxBarSize={12} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function Stats() {
  const { habits, getStreak, getLongestStreak, getCompletionRate, theme } = useStore()
  const [selected, setSelected] = useState(null)
  const t = THEMES[theme] || THEMES[DEFAULT_THEME]
  const chartColors = {
    tick: t.vars['--text-soft'],
    tooltipBg: t.vars['--bg'],
    tooltipBorder: t.vars['--border'],
  }

  if (habits.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">✧</div>
          <p>no stats yet</p>
          <p className="sub">start tracking to see your progress</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-title">my stats</h2>

      <div className="habit-selector">
        {habits.map(h => (
          <button
            key={h.id}
            className={`habit-chip ${selected === h.id ? 'active' : ''}`}
            onClick={() => setSelected(selected === h.id ? null : h.id)}
          >
            {h.name}
          </button>
        ))}
        {!selected && habits.length > 0 && (
          <span className="hint">pick a task ♡</span>
        )}
      </div>

      {selected && (() => {
        const h = habits.find(x => x.id === selected)
        if (!h) return null
        const streak = getStreak(h)
        const longest = getLongestStreak(h)
        const rate = getCompletionRate(h, 30)
        return (
          <div className="stats-detail">
            <h3 className="stats-habit-name" style={{ color: h.color }}>{h.name}</h3>
            <div className="stats-cards">
              <div className="stat-card" style={{ borderTopColor: h.color }}>
                <span className="stat-value">{streak}</span>
                <span className="stat-label">current streak</span>
              </div>
              <div className="stat-card" style={{ borderTopColor: h.color }}>
                <span className="stat-value">{longest}</span>
                <span className="stat-label">best streak</span>
              </div>
              <div className="stat-card" style={{ borderTopColor: h.color }}>
                <span className="stat-value">{rate}%</span>
                <span className="stat-label">30 day rate</span>
              </div>
            </div>

            <div className="stats-section">
              <h4>last 28 days</h4>
              <CalendarHeatmap entries={h.entries} color={h.color} />
            </div>

            <div className="stats-section">
              <h4>last 30 days</h4>
              <MonthChart entries={h.entries} color={h.color} colors={chartColors} />
            </div>
          </div>
        )
      })()}
    </div>
  )
}
