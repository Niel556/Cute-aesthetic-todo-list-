import { useState, useEffect, createContext, useContext } from 'react'

const StoreContext = createContext()

function loadData() {
  try {
    const raw = localStorage.getItem('coquette-data')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { habits: [], notes: {}, moods: {} }
}

function saveData(data) {
  localStorage.setItem('coquette-data', JSON.stringify(data))
}

function today() {
  return new Date().toISOString().slice(0, 10)
}

function genId() {
  return Math.random().toString(36).slice(2, 9)
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadData)

  useEffect(() => { saveData(data) }, [data])

  function addHabit(name, description, color, priority) {
    setData(d => ({
      ...d,
      habits: [...d.habits, {
        id: genId(),
        name,
        description,
        color,
        priority: priority || 'medium',
        createdAt: today(),
        entries: {},
      }],
    }))
  }

  function updateHabit(id, fields) {
    setData(d => ({
      ...d,
      habits: d.habits.map(h => h.id === id ? { ...h, ...fields } : h),
    }))
  }

  function deleteHabit(id) {
    setData(d => ({ ...d, habits: d.habits.filter(h => h.id !== id) }))
  }

  function toggleEntry(habitId, date) {
    setData(d => ({
      ...d,
      habits: d.habits.map(h => {
        if (h.id !== habitId) return h
        const entries = { ...h.entries }
        if (entries[date]) delete entries[date]
        else entries[date] = true
        return { ...h, entries }
      }),
    }))
  }

  function saveNote(date, text) {
    setData(d => ({ ...d, notes: { ...d.notes, [date]: text } }))
  }

  function saveMood(date, mood) {
    setData(d => ({ ...d, moods: { ...d.moods, [date]: mood } }))
  }

  function getStreak(habit) {
    if (!habit || !habit.entries) return 0
    const dates = Object.keys(habit.entries).sort().reverse()
    if (dates.length === 0) return 0
    let streak = 0
    let check = new Date()
    while (true) {
      const key = check.toISOString().slice(0, 10)
      if (dates.includes(key)) {
        streak++
        check.setDate(check.getDate() - 1)
      } else {
        break
      }
    }
    return streak
  }

  function getLongestStreak(habit) {
    if (!habit || !habit.entries) return 0
    const dates = Object.keys(habit.entries).map(d => new Date(d)).sort((a, b) => a - b)
    if (dates.length === 0) return 0
    let longest = 1, current = 1
    for (let i = 1; i < dates.length; i++) {
      const diff = (dates[i] - dates[i - 1]) / (1000 * 60 * 60 * 24)
      if (diff === 1) {
        current++
        longest = Math.max(longest, current)
      } else {
        current = 1
      }
    }
    return longest
  }

  function getCompletionRate(habit, days = 30) {
    if (!habit || !habit.entries) return 0
    let completed = 0
    for (let i = 0; i < days; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().slice(0, 10)
      if (habit.entries[key]) completed++
    }
    return days > 0 ? Math.round((completed / days) * 100) : 0
  }

  return (
    <StoreContext.Provider value={{
      habits: data.habits,
      notes: data.notes,
      moods: data.moods,
      addHabit,
      updateHabit,
      deleteHabit,
      toggleEntry,
      saveNote,
      saveMood,
      getStreak,
      getLongestStreak,
      getCompletionRate,
      today,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  return useContext(StoreContext)
}
