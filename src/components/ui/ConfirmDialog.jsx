import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Modal } from './Modal'

export const ConfirmDialog = ({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  isLoading = false,
  onConfirm, 
  onCancel,
  isDangerous = false
}) => {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onCancel}
      title={title}
      size="sm"
      footer={
        <>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-white transition disabled:opacity-50 ${
              isDangerous 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Processando...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex gap-4">
        <AlertCircle 
          size={24} 
          className={isDangerous ? 'text-red-500 flex-shrink-0' : 'text-yellow-500 flex-shrink-0'}
        />
        <p className="text-gray-700">{message}</p>
      </div>
    </Modal>
  )
}
