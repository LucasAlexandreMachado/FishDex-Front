import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { locationService } from '../../services/locationService'
import { useToast } from '../../hooks/useToast'
import { LocationFormModal } from './LocationFormModal'
import { LocationTable } from './LocationTable'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export const LocationsPage = () => {
  const [locations, setLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchLocations()
  }, [])

  const fetchLocations = async () => {
    try {
      setIsLoading(true)
      const data = await locationService.getLocations()
      setLocations(data)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao carregar localizações'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenForm = (locationData = null) => {
    setEditingLocation(locationData)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingLocation(null)
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)

      if (editingLocation?.id) {
        // Update
        await locationService.updateLocation(editingLocation.id, formData)
        setLocations(prev =>
          prev.map(l => l.id === editingLocation.id ? { ...l, ...formData } : l)
        )
        toast.success('Localização atualizada com sucesso!')
      } else {
        // Create
        const newLocation = await locationService.createLocation(formData)
        setLocations(prev => [...prev, newLocation])
        toast.success('Localização criada com sucesso!')
      }

      handleCloseForm()
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar localização'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = (locationData) => {
    setDeleteConfirm(locationData)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true)
      await locationService.deleteLocation(deleteConfirm.id)
      setLocations(prev => prev.filter(l => l.id !== deleteConfirm.id))
      toast.success('Localização deletada com sucesso!')
      setDeleteConfirm(null)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao deletar localização'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Localizações</h1>
          <p className="mt-2 text-sm text-gray-600">Gerenciar todos os locais de pesca cadastrados</p>
        </div>
        <button
          onClick={() => handleOpenForm()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          <Plus size={20} />
          Nova Localização
        </button>
      </div>

      <LocationTable
        locations={locations}
        onEdit={handleOpenForm}
        onDelete={handleDeleteConfirm}
        isLoading={isLoading}
      />

      <LocationFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingLocation}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Deletar Localização"
        message={`Tem certeza que deseja deletar a localização "${deleteConfirm?.name}"? As capturas vinculadas a este local não serão removidas, apenas desvinculadas. Esta ação não pode ser desfeita.`}
        confirmText="Deletar"
        cancelText="Cancelar"
        isDangerous={true}
        isLoading={isLoading}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  )
}
