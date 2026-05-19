import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { speciesService } from '../../services/speciesService'

export const CatchFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {
  const initialFormData = {
    location: initialData?.location ?? '',
    speciesId: initialData?.speciesId ?? initialData?.species?.id ?? ''
  }

  const [formData, setFormData] = useState(initialFormData)
  const [species, setSpecies] = useState([])

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData)
      fetchSpecies()
    }
  }, [isOpen, initialData])

  const fetchSpecies = async () => {
    try {
      const data = await speciesService.getSpecies()
      setSpecies(data)
    } catch (error) {
      console.error('Erro ao carregar espécies:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'speciesId' ? parseInt(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData?.id ? 'Editar Captura' : 'Nova Captura'}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="catch-form"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {isLoading ? 'Salvando...' : 'Salvar'}
          </button>
        </>
      }
    >
      <form id="catch-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Espécie *
          </label>
          <select
            name="speciesId"
            value={formData.speciesId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma espécie</option>
            {species.map(s => (
              <option key={s.id} value={s.id}>
                {s.commonName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Lago Superior, Rio Amazonas"
          />
        </div>
      </form>
    </Modal>
  )
}
