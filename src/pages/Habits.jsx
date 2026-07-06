import React, { useState } from 'react'
import { useStore } from '../store'

const COLORS = ['#8B7D6B', '#A8B5A2', '#D4A574', '#C28F7A', '#7A9B8C', '#B8A9A0']

export default function Habits() {
  const { habits, addHabit, updateHabit, deleteHabit } = useStore()
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')
  const [color, setColor] = useState(COLORS[0])

  function resetForm() {
    setName('')
    setDesc('')
    setColor(COLORS[0])
    setEditId(null)
    setShowForm(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    if (editId) {
      updateHabit(editId, { name: name.trim(), description: desc.trim(), color })
    } else {
      addHabit(name.trim(), desc.trim(), color)
    }
    resetForm()
  }

  function handleEdit(h) {
    setName(h.name)
    setDesc(h.description || '')
    setColor(h.color || COLORS[0])
    setEditId(h.id)
    setShowForm(true)
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2 className="page-title">All Habits</h2>
        <button className="btn" onClick={() => { resetForm(); setShowForm(true) }}>
          + New
        </button>
      </div>

      {showForm && (
        <form className="habit-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input
              className="input"
              placeholder="Habit name"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
            <input
              className="input"
              placeholder="Description (optional)"
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
          <div className="form-actions">
            <button type="submit" className="btn primary">{editId ? 'Save' : 'Create'}</button>
            <button type="button" className="btn" onClick={resetForm}>Cancel</button>
          </div>
        </form>
      )}

      {habits.length === 0 ? (
        <div className="empty-state">
          <p>No habits yet.</p>
        </div>
      ) : (
        <div className="habit-list">
          {habits.map(h => (
            <div key={h.id} className="habit-card manage" style={{ borderLeftColor: h.color || COLORS[0] }}>
              <div className="habit-info">
                <span className="habit-name">{h.name}</span>
                {h.description && <span className="habit-desc">{h.description}</span>}
              </div>
              <div className="habit-actions">
                <button className="btn small" onClick={() => handleEdit(h)}>edit</button>
                <button className="btn small danger" onClick={() => deleteHabit(h.id)}>delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
