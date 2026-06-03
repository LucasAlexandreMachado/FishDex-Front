
import React, { useState, useEffect } from 'react'
import { Modal } from '../ui/Modal'
import { speciesService } from '../../services/speciesService'
import { locationService } from '../../services/locationService'
import { uploadService } from '../../services/uploadService'

export const CatchFormModal = ({ isOpen, onClose, onSubmit, initialData, isLoading }) => {

  const initialFormData = {
    locationId: initialData?.locationId ?? initialData?.location?.id ?? '',
    speciesId: initialData?.speciesId ?? initialData?.species?.id ?? '',
    imageUrl: initialData?.imageUrl ?? ''
  }


  const [formData, setFormData] = useState(initialFormData)
  const [species, setSpecies] = useState([])
  const [locations, setLocations] = useState([])
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(initialFormData.imageUrl || '')
  const [isUploading, setIsUploading] = useState(false)


  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData)
      setImagePreview(initialFormData.imageUrl || '')
      setImageFile(null)
      fetchSpecies()
      fetchLocations()
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

  const fetchLocations = async () => {
    try {
      const data = await locationService.getLocations()
      setLocations(data)
    } catch (error) {
      console.error('Erro ao carregar localizações:', error)
    }
  }


  const handleChange = (e) => {
    const { name, value, files } = e.target
    if (name === 'image') {
      const file = files[0]
      setImageFile(file)
      if (file) {
        const reader = new FileReader()
        reader.onloadend = () => setImagePreview(reader.result)
        reader.readAsDataURL(file)
      } else {
        setImagePreview('')
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'speciesId' || name === 'locationId' ? parseInt(value) : value
      }))
    }
  }


  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = formData.imageUrl
    if (imageFile) {
      setIsUploading(true)
      try {
        const { url } = await uploadService.uploadFile(imageFile)
        imageUrl = url
      } catch (err) {
        alert('Erro ao enviar imagem')
        setIsUploading(false)
        return
      }
      setIsUploading(false)
    }
    onSubmit({ ...formData, imageUrl })
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Peixe</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    disabled={isUploading || isLoading}
                    className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 rounded-lg border border-gray-200 max-h-40 object-contain"
                      style={{ maxWidth: '100%' }}
                    />
                  )}
                </div>
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
          <select
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma localização</option>
            {locations.map(l => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
          <p className="mt-2 text-sm text-gray-500">
            Crie novas localizações na página de Localizações.
          </p>
        </div>
      </form>
    </Modal>
  )
}
