import React, { useState, useEffect } from 'react'
import { Anchor, MapPin, Calendar, Zap } from 'lucide-react'
import { catchService } from '../../services/catchService'
import { useToast } from '../../hooks/useToast'
import { formatDate } from '../../utils/formatDate'

export const HomePage = () => {
  const [catches, setCatches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalCatches: 0,
    totalSpecies: 0,
    totalLocations: 0
  })
  const toast = useToast()

  useEffect(() => {
    fetchCatches()
  }, [])

  const fetchCatches = async () => {
    try {
      setIsLoading(true)
      const data = await catchService.getCatches()
      setCatches(data)

      // Calculate stats
      const uniqueSpecies = new Set(data.map(c => c.speciesId)).size
      const uniqueLocations = new Set(data.map(c => c.locationId)).size

      setStats({
        totalCatches: data.length,
        totalSpecies: uniqueSpecies,
        totalLocations: uniqueLocations
      })
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao carregar peixes'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const getPlaceholderImage = (species) => {
    // Retorna uma cor baseada no hash do nome da espécie
    const colors = ['from-blue-400 to-blue-600', 'from-purple-400 to-purple-600', 'from-green-400 to-green-600', 'from-orange-400 to-orange-600', 'from-pink-400 to-pink-600', 'from-indigo-400 to-indigo-600']
    let hash = 0
    for (let i = 0; i < (species?.commonName || '').length; i++) {
      hash = ((hash << 5) - hash) + (species?.commonName || '').charCodeAt(i)
      hash = hash & hash
    }
    return colors[Math.abs(hash) % colors.length]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Meu Aquário Digital</h1>
        <p className="mt-2 text-gray-600">Visualize todos os seus peixes já capturados</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Capturas</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalCatches}</p>
            </div>
            <Anchor size={32} className="text-blue-500" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Espécies Diferentes</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalSpecies}</p>
            </div>
            <Zap size={32} className="text-yellow-500" />
          </div>
        </div>

        <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Locais de Pesca</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stats.totalLocations}</p>
            </div>
            <MapPin size={32} className="text-green-500" />
          </div>
        </div>
      </div>

      {/* Fish Gallery */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Galeria de Peixes</h2>

        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Carregando seus peixes...</div>
        ) : catches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catches.map(catchData => (
              <div key={catchData.id} className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Image */}
                {catchData.imageUrl ? (
                  <img
                    src={catchData.imageUrl}
                    alt={catchData.species?.commonName}
                    className="w-full h-52 object-cover group-hover:opacity-90 transition-opacity"
                  />
                ) : (
                  <div className={`w-full h-52 bg-gradient-to-br ${getPlaceholderImage(catchData.species)} flex items-center justify-center`}>
                    <Anchor size={40} className="text-white opacity-60" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <div className="space-y-3">
                    {/* Species Name */}
                    <div>
                      <p className="font-bold text-lg text-gray-900">{catchData.species?.commonName || 'Desconhecida'}</p>
                      {catchData.species?.scientificName && (
                        <p className="text-sm text-gray-500 italic">{catchData.species.scientificName}</p>
                      )}
                    </div>

                    {/* Location */}
                    {catchData.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin size={16} />
                        <span>{catchData.location.name}</span>
                      </div>
                    )}

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>{formatDate(catchData.catchDate)}</span>
                    </div>

                    {/* Details Summary */}
                    {catchData.catchDetail && (
                      <div className="pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-1">
                        {catchData.catchDetail.weightKg && (
                          <p><span className="font-medium text-gray-700">Peso:</span> {catchData.catchDetail.weightKg} kg</p>
                        )}
                        {catchData.catchDetail.lengthCm && (
                          <p><span className="font-medium text-gray-700">Tamanho:</span> {catchData.catchDetail.lengthCm} cm</p>
                        )}
                        {catchData.catchDetail.baitUsed && (
                          <p><span className="font-medium text-gray-700">Isca:</span> {catchData.catchDetail.baitUsed}</p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Nenhum peixe capturado ainda</p>
            <p className="text-sm">Comece a registrar suas capturas!</p>
          </div>
        )}
      </div>
    </div>
  )
}
