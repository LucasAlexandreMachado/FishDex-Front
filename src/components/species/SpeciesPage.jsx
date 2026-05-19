import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { speciesService } from '../../services/speciesService'
import { useToast } from '../../hooks/useToast'
import { SpeciesFormModal } from './SpeciesFormModal'
import { SpeciesTable } from './SpeciesTable'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export const SpeciesPage = () => {
  const [species, setSpecies] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSpecies, setEditingSpecies] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchSpecies()
  }, [])

  const fetchSpecies = async () => {
    try {
      setIsLoading(true)
      const data = await speciesService.getSpecies()
      setSpecies(data)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao carregar espécies'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenForm = (speciesData = null) => {
    setEditingSpecies(speciesData)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingSpecies(null)
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)

      if (editingSpecies?.id) {
        // Update
        await speciesService.updateSpecies(editingSpecies.id, formData)
        setSpecies(prev => 
          prev.map(s => s.id === editingSpecies.id ? { ...s, ...formData } : s)
        )
        toast.success('Espécie atualizada com sucesso!')
      } else {
        // Create
        const newSpecies = await speciesService.createSpecies(formData)
        setSpecies(prev => [...prev, newSpecies])
        toast.success('Espécie criada com sucesso!')
      }

      handleCloseForm()
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar espécie'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteConfirm = (speciesData) => {
    setDeleteConfirm(speciesData)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true)
      await speciesService.deleteSpecies(deleteConfirm.id)
      setSpecies(prev => prev.filter(s => s.id !== deleteConfirm.id))
      toast.success('Espécie deletada com sucesso!')
      setDeleteConfirm(null)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao deletar espécie'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Espécies</h1>
        <button
          onClick={() => handleOpenForm()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          <Plus size={20} />
          Nova Espécie
        </button>
      </div>

      <SpeciesTable
        species={species}
        onEdit={handleOpenForm}
        onDelete={handleDeleteConfirm}
        isLoading={isLoading}
      />

      <SpeciesFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingSpecies}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Deletar Espécie"
        message={`Tem certeza que deseja deletar a espécie "${deleteConfirm?.commonName}"? Esta ação não pode ser desfeita.`}
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
