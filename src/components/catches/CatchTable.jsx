import React from 'react'
import { Trash2, Edit2, Info } from 'lucide-react'
import { formatDate } from '../../utils/formatDate'

export const CatchTable = ({ catches, onEdit, onDelete, onDetail, isLoading }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Espécie</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Localização</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Data</th>
            <th className="px-6 py-3 text-right text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {catches.map(c => (
            <tr key={c.id} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-900">{c.species?.commonName || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{c.location?.name || '—'}</td>
              <td className="px-6 py-4 text-sm text-gray-600">{formatDate(c.catchDate)}</td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onDetail(c)}
                    disabled={isLoading}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition disabled:opacity-50"
                    title="Ver/Editar Detalhes"
                  >
                    <Info size={18} />
                  </button>
                  <button
                    onClick={() => onEdit(c)}
                    disabled={isLoading}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(c)}
                    disabled={isLoading}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                    title="Deletar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {catches.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhuma captura registrada
        </div>
      )}
    </div>
  )
}
