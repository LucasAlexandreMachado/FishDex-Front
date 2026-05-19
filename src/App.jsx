import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { SpeciesPage } from './components/species/SpeciesPage'
import { CatchesPage } from './components/catches/CatchesPage'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/ui/Toast'

function App() {
  const [currentPage, setCurrentPage] = useState('species')

  const renderPage = () => {
    switch (currentPage) {
      case 'species':
        return <SpeciesPage />
      case 'catches':
        return <CatchesPage />
      case 'locations':
        return <div className="p-8 text-center text-gray-500">Página em desenvolvimento</div>
      default:
        return <SpeciesPage />
    }
  }

  return (
    <ToastProvider>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="flex-1 p-8">
          {renderPage()}
        </main>

        <ToastContainer />
      </div>
    </ToastProvider>
  )
}

export default App
