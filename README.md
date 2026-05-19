# Fish Pokédex - Frontend

Frontend React/Vite para gerenciar um registro de capturas de peixes.

## 🚀 Instalação

```bash
npm install
```

## 🏃 Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

## 🔨 Build

```bash
npm run build
```

## 📋 Estrutura do Projeto

```
src/
├── components/
│   ├── catches/           # Componentes de Capturas
│   │   ├── CatchesPage.jsx
│   │   ├── CatchFormModal.jsx
│   │   ├── CatchTable.jsx
│   │   └── CatchDetailModal.jsx (Smart 1:1 Modal)
│   ├── species/           # Componentes de Espécies
│   │   ├── SpeciesPage.jsx
│   │   ├── SpeciesFormModal.jsx
│   │   └── SpeciesTable.jsx
│   ├── layout/             # Componentes de Layout
│   │   └── Sidebar.jsx
│   └── ui/                 # Componentes Reutilizáveis
│       ├── Modal.jsx
│       ├── Toast.jsx
│       └── ConfirmDialog.jsx
├── services/              # API Services
│   ├── speciesService.js
│   ├── catchService.js
│   ├── catchDetailService.js
│   └── axiosConfig.js
├── contexts/              # React Contexts
│   └── ToastContext.jsx
├── hooks/                 # Custom Hooks
│   └── useToast.js
├── utils/                 # Utility Functions
│   └── formatDate.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🔌 API Integration

Base URL: `http://localhost:5238/api`

- **Species**: GET/POST/PUT/DELETE `/species`
- **Catches**: GET/POST/PUT/DELETE `/catches`
- **CatchDetails**: GET/POST/PUT/DELETE `/catchdetails`

## 💡 Principais Features

✅ CRUD completo de Espécies
✅ CRUD completo de Capturas
✅ Modal inteligente para detalhes 1:1 (Create/Edit/Delete)
✅ Tratamento de erros global com Toast
✅ State management otimizado (sem re-fetch desnecessário)
✅ UI Responsiva com Tailwind CSS
✅ Sidebar com navegação

## 🎨 Tecnologias

- **React 18** - UI Framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP Client

## 📝 Notas Importantes

- O `catchDate` é gerado automaticamente pelo backend (não enviar do frontend)
- A relação entre Catch e CatchDetail é 1:1 com CASCADE DELETE
- Espécie não pode ser deletada se tiver capturas vinculadas (DELETE RESTRICT)
- Um erro 404 ao abrir CatchDetailModal significa que a captura não tem detalhes ainda
