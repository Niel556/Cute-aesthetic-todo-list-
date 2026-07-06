import React, { useState } from 'react'
import { useStore } from '../store'

const COLORS = ['#FFB5C2', '#C9B8E8', '#B8E8D4', '#FFD4B8', '#B8D4E8', '#FFE8B8']
const PRIORITIES = [
  { value: 'low', icon: '💫', label: 'low' },
  { value: 'medium', icon: '⭐', label: 'medium' },
  { value: 'high', icon: '🌟', label: 'high' },
]
const PRIORITY_ICONS = { low: '💫', medium: '⭐', high: '🌟' }

export default function Tasks() {
  const { habits, addHabit, updateHabit, deleteHabit } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [priority, setPriority] = useState('medium')

  function resetForm() {
    setName('')
    setDesc('')
    setColor(COLORS[0])
    setPriority('medium')
    setEditId(null)
    setShowForm(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (editId) {
      updateHabit(editId, { name: name.trim(), description: desc.trim(), color, priority })
    } else {
      addHabit(name.trim(), desc.trim(), color, priority)
    }
    resetForm()
  }

  function handleEdit(h) {
    setName(h.name)
    setDesc(h.description || '')
    setColor(h.color || COLORS[0])
    setPriority(h.priority || 'medium')
    setEditId(h.id)
    setShowForm(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">my tasks</h2>
        <button className="btn add-btn" onClick={() => { resetForm(); setShowForm(true) }}>
          + new
        </button>
      </div>

      {showForm && (
        <form className="habit-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className="input"
              placeholder="task name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <input
              className="input"
              placeholder="notes (optional)"
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>
          <div className="form-row color-row">
            {COLORS.map(c => (
              <button
                key={c}
                type="button"
                className={`color-swatch ${color === c ? 'selected' : ''}`}
                style={{ backgroundColor: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <div className="form-row priority-row">
            <span className="priority-label">priority</span>
            <div className="priority-options">
              {PRIORITIES.map(p => (
                <button
                  key={p.value}
                  type="button"
                  className={`priority-btn ${priority === p.value ? 'active' : ''}`}
                  onClick={() => setPriority(p.value)}
                >
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="btn primary">{editId ? 'save' : 'create'}</button>
            <button type="button" className="btn cancel-btn" onClick={resetForm}>cancel</button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✿</div>
          <p>no tasks yet</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map(h => (
            <div key={h.id} className="habit-card manage" style={{ borderLeftColor: h.color || COLORS[0] }}>
              <div className="task-color-dot" style={{ backgroundColor: h.color || COLORS[0] }} />
              <div className="habit-info">
                <span className="habit-name">
                  <span className="priority-icon">{PRIORITY_ICONS[h.priority] || '⭐'}</span>
                  {h.name}
                </span>
                {h.description && <span className="habit-desc">{h.description}</span>}
              </div>
              <div className="habit-actions">
                <button className="btn small edit-btn" onClick={() => handleEdit(h)}>edit</button>
                <button className="btn small delete-btn" onClick={() => deleteHabit(h.id)}>del</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
