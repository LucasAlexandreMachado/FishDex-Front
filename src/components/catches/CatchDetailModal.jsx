import React, { useState, useEffect } from 'react'
import { AlertCircle, Plus, Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { useToast } from '../../hooks/useToast'
import { catchDetailService } from '../../services/catchDetailService'

export const CatchDetailModal = ({ isOpen, onClose, catch: catchData, onDetailSaved, isLoading }) => {
  const [detailData, setDetailData] = useState(null)
  const [formData, setFormData] = useState({
    weightKg: '',
    lengthCm: '',
    baitUsed: '',
    weatherCondition: ''
  })
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (isOpen && catchData?.id) {
      fetchDetail()
    }
  }, [isOpen, catchData?.id])

  const fetchDetail = async () => {
    try {
      setIsLoadingDetail(true)
      const data = await catchDetailService.getDetailByCatchId(catchData.id)
      setDetailData(data)
      setFormData({
        weightKg: data.weightKg || '',
        lengthCm: data.lengthCm || '',
        baitUsed: data.baitUsed || '',
        weatherCondition: data.weatherCondition || ''
      })
    } catch (error) {
      // 404 is expected - means no details exist yet
      if (error.response?.status !== 404) {
        const msg = error.response?.data?.error || 'Erro ao carregar detalhes'
        toast.error(msg)
      }
      setDetailData(null)
      setFormData({
        weightKg: '',
        lengthCm: '',
        baitUsed: '',
        weatherCondition: ''
      })
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setIsLoadingDetail(true)

      if (detailData?.id) {
        // Update existing detail
        await catchDetailService.updateDetail(detailData.id, formData)
        await fetchDetail()
        toast.success('Detalhes atualizados com sucesso!')
      } else {
        // Create new detail
        const payload = {
          ...formData,
          catchId: catchData.id,
          weightKg: formData.weightKg ? parseFloat(formData.weightKg) : null,
          lengthCm: formData.lengthCm ? parseFloat(formData.lengthCm) : null
        }
        await catchDetailService.createDetail(payload)
        await fetchDetail()
        toast.success('Detalhes criados com sucesso!')
      }

      onDetailSaved?.()
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao salvar detalhes'
      toast.error(msg)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const handleDeleteDetail = async () => {
    if (!detailData?.id) return

    try {
      setIsLoadingDetail(true)
      await catchDetailService.deleteDetail(detailData.id)
      setDetailData(null)
      setFormData({
        weightKg: '',
        lengthCm: '',
        baitUsed: '',
        weatherCondition: ''
      })
      toast.success('Detalhes deletados com sucesso!')
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao deletar detalhes'
      toast.error(msg)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const hasDetails = !!detailData

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Detalhes da Captura - ${catchData?.species?.commonName || 'Desconhecida'}`}
      size="md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingDetail}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            Fechar
          </button>
          {hasDetails && (
            <button
              type="button"
              onClick={handleDeleteDetail}
              disabled={isLoadingDetail}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center gap-2"
            >
              <Trash2 size={18} />
              Deletar Detalhes
            </button>
          )}
          <button
            type="submit"
            form="detail-form"
            disabled={isLoadingDetail}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
          >
            <Plus size={18} />
            {isLoadingDetail ? 'Processando...' : hasDetails ? 'Atualizar' : 'Adicionar Detalhes'}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Localização</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{catchData?.location || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Espécie</p>
            <p className="mt-1 text-sm font-medium text-slate-900">{catchData?.species?.commonName || 'Não informada'}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Data da captura</p>
            <p className="mt-1 text-sm font-medium text-slate-900">
              {catchData?.catchDate ? new Date(catchData.catchDate).toLocaleDateString('pt-BR') : 'Não informada'}
            </p>
          </div>
        </div>

        {!hasDetails && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex gap-3">
            <AlertCircle size={20} className="text-yellow-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-yellow-900">Modo Criação</p>
              <p className="text-sm text-yellow-800">Esta captura ainda não possui detalhes. Preencha o formulário abaixo para adicioná-los.</p>
            </div>
          </div>
        )}

        <form id="detail-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg)
              </label>
              <input
                type="number"
                name="weightKg"
                value={formData.weightKg}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comprimento (cm)
              </label>
              <input
                type="number"
                name="lengthCm"
                value={formData.lengthCm}
                onChange={handleChange}
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="45.5"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Isca
            </label>
            <input
              type="text"
              name="baitUsed"
              value={formData.baitUsed}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Isca viva, Artificial"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condição do Tempo
            </label>
            <input
              type="text"
              name="weatherCondition"
              value={formData.weatherCondition}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Ensolarado, Nublado, Chuvoso"
            />
          </div>
        </form>

        {hasDetails && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
            <p className="font-medium">Modo Edição</p>
            <p>Você está editando os detalhes existentes desta captura.</p>
          </div>
        )}
      </div>
    </Modal>
  )
}
