import React, { useState } from 'react'
import { StoreProvider } from './store'
import ErrorBoundary from './ErrorBoundary'
import TitleBar from './components/TitleBar'
import Navbar from './components/Navbar'
import Today from './pages/Today'
import Tasks from './pages/Tasks'
import Stats from './pages/Stats'

export default function App() {
  const [page, setPage] = useState('today')

  return (
    <StoreProvider>
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
