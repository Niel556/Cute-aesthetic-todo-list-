import React, { useState, useEffect } from 'react'
import { StoreProvider, useStore } from './store'
import { THEMES, DEFAULT_THEME } from './themes'
import ErrorBoundary from './ErrorBoundary'
import TitleBar from './components/TitleBar'
import Navbar from './components/Navbar'
import Today from './pages/Today'
import Tasks from './pages/Tasks'
import Stats from './pages/Stats'

function ThemeApplier() {
  const { theme } = useStore()
  useEffect(() => {
    const t = THEMES[theme] || THEMES[DEFAULT_THEME]
    const root = document.documentElement
    for (const [key, val] of Object.entries(t.vars)) {
      root.style.setProperty(key, val)
    }
  }, [theme])
  return null
}

export default function App() {
  const [page, setPage] = useState('today')

  return (
    <StoreProvider>
      <ThemeApplier />
      <ErrorBoundary>
        <div className="app">
          <TitleBar />
          <main className="main">
            {page === 'today' && <Today />}
            {page === 'tasks' && <Tasks />}
            {page === 'stats' && <Stats />}
          </main>
          <Navbar active={page} onChange={setPage} />
        </div>
      </ErrorBoundary>
    </StoreProvider>
  )
}
