import React from 'react'
import { Trash2, Edit2 } from 'lucide-react'

export const LocationTable = ({ locations, onEdit, onDelete, isLoading }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Descrição</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {isLoading ? (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                Carregando localizações...
              </td>
            </tr>
          ) : locations && locations.length > 0 ? (
            locations.map(location => (
              <tr key={location.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-sm text-gray-900">{location.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{location.description || '-'}</td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(location)}
                      disabled={isLoading}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                      title="Editar"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(location)}
                      disabled={isLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50"
                      title="Deletar"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="px-6 py-4 text-center text-gray-500">
                Nenhuma localização cadastrada yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
