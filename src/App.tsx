import { useState } from 'react'
import { StudentDashboard } from './pages/StudentDashboard.tsx'
import { Sidebar } from './components/sidebar.tsx'

import './App.css'

function App() {
  const [] = useState(0)

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans antialiased">
      <Sidebar/>
      <main className="flex-1 max-h-screen overflow-y-auto">
        <StudentDashboard/>  
      </main>
    </div>
  )
}

export default App
