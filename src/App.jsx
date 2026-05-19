import React, { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { HomePage } from './components/home/HomePage'
import { SpeciesPage } from './components/species/SpeciesPage'
import { CatchesPage } from './components/catches/CatchesPage'
import { LocationsPage } from './components/locations/LocationsPage'
import { ToastProvider } from './contexts/ToastContext'
import { ToastContainer } from './components/ui/Toast'

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />
      case 'species':
        return <SpeciesPage />
      case 'catches':
        return <CatchesPage />
      case 'locations':
        return <LocationsPage />
      default:
        return <HomePage />
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
