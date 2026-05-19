import React, { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { catchService } from '../../services/catchService'
import { useToast } from '../../hooks/useToast'
import { CatchFormModal } from './CatchFormModal'
import { CatchTable } from './CatchTable'
import { CatchDetailModal } from './CatchDetailModal'
import { ConfirmDialog } from '../ui/ConfirmDialog'

export const CatchesPage = () => {
  const [catches, setCatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCatch, setEditingCatch] = useState(null)
  const [selectedCatch, setSelectedCatch] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const toast = useToast()

  useEffect(() => {
    fetchCatches()
  }, [])

  const fetchCatches = async () => {
    try {
      setIsLoading(true)
      const data = await catchService.getCatches()
      setCatches(data)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao carregar capturas'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenForm = (catchData = null) => {
    setEditingCatch(catchData)
    setIsFormOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormOpen(false)
    setEditingCatch(null)
  }

  const handleSubmit = async (formData) => {
    try {
      setIsLoading(true)

      if (editingCatch?.id) {
        // Update
        await catchService.updateCatch(editingCatch.id, formData)
        setCatches(prev => 
          prev.map(c => c.id === editingCatch.id ? { ...c, ...formData } : c)
        )
        toast.success('Captura atualizada com sucesso!')
      } else {
        // Create
        const newCatch = await catchService.createCatch(formData)
        setCatches(prev => [...prev, newCatch])
        toast.success('Captura criada com sucesso!')
      }

      handleCloseForm()
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar captura'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenDetail = (catchData) => {
    setSelectedCatch(catchData)
    setIsDetailOpen(true)
  }

  const handleCloseDetail = () => {
    setIsDetailOpen(false)
    setSelectedCatch(null)
  }

  const handleDetailSaved = async () => {
    // Refresh catches to get updated data
    await fetchCatches()
  }

  const handleDeleteConfirm = (catchData) => {
    setDeleteConfirm(catchData)
  }

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true)
      await catchService.deleteCatch(deleteConfirm.id)
      setCatches(prev => prev.filter(c => c.id !== deleteConfirm.id))
      toast.success('Captura deletada com sucesso!')
      setDeleteConfirm(null)
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao deletar captura'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Capturas</h1>
        <button
          onClick={() => handleOpenForm()}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
        >
          <Plus size={20} />
          Nova Captura
        </button>
      </div>

      <CatchTable
        catches={catches}
        onEdit={handleOpenForm}
        onDelete={handleDeleteConfirm}
        onDetail={handleOpenDetail}
        isLoading={isLoading}
      />

      <CatchFormModal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
        initialData={editingCatch}
        isLoading={isLoading}
      />

      <CatchDetailModal
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
        catch={selectedCatch}
        onDetailSaved={handleDetailSaved}
        isLoading={isLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        title="Deletar Captura"
        message={`Tem certeza que deseja deletar a captura em "${deleteConfirm?.location}"? Os detalhes associados também serão removidos. Esta ação não pode ser desfeita.`}
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
