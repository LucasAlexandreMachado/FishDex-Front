import React, { useContext } from 'react'
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { ToastContext } from '../../contexts/ToastContext'

const ToastIcon = ({ type }) => {
  const icons = {
    success: <CheckCircle size={20} className="text-green-500" />,
    error: <AlertCircle size={20} className="text-red-500" />,
    warning: <AlertTriangle size={20} className="text-yellow-500" />,
    info: <Info size={20} className="text-blue-500" />
  }
  return icons[type] || icons.info
}

const getToastStyles = (type) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  return styles[type] || styles.info
}

export const Toast = ({ id, message, type, onClose }) => {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg border ${getToastStyles(type)} shadow-lg`}>
      <ToastIcon type={type} />
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="text-gray-400 hover:text-gray-600 transition"
      >
        <X size={18} />
      </button>
    </div>
  )
}

export const ToastContainer = () => {
  const { toasts, removeToast } = useContext(ToastContext)

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-md">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}
