import React, { useState } from 'react'
import { Fish, MapPin, Anchor, Menu, X, Home } from 'lucide-react'

export const Sidebar = ({ currentPage, onPageChange }) => {
  const [isOpen, setIsOpen] = useState(true)

  const menuItems = [
    { id: 'home', label: 'Meu Aquário', icon: Home },
    { id: 'species', label: 'Espécies', icon: Fish },
    { id: 'catches', label: 'Capturas', icon: Anchor },
    { id: 'locations', label: 'Localizações', icon: MapPin }
  ]

  return (
    <>
      {/* Sidebar */}
      <aside className={`${
        isOpen ? 'w-64' : 'w-20'
      } bg-gray-900 text-white transition-all duration-300 fixed h-screen left-0 top-0 z-40 overflow-y-auto`}>
        {/* Header */}
        <div className="p-4 flex items-center justify-between">
          {isOpen && <h1 className="text-2xl font-bold">Fish Pokédex</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-800 rounded-lg transition"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="pt-8">
          {menuItems.map(item => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={24} />
                {isOpen && <span className="font-medium">{item.label}</span>}
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Spacer - Push content to the right */}
      <div className={isOpen ? 'w-64' : 'w-20'} />
    </>
  )
}
