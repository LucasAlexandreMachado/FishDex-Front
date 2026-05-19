# 🎣 Fish Pokédex - Frontend Completo

## ✅ Estrutura Criada com Sucesso

Seu frontend React com Vite foi criado completamente, integrando todos os contextos do backend e frontend que você forneceu.

### 📦 Arquivos Criados: 20+

**Configuração Base:**
- `package.json` - Dependências (React, Vite, Tailwind, Lucide, Axios)
- `vite.config.js` - Configuração Vite
- `tailwind.config.js` - Configuração Tailwind
- `postcss.config.js` - Processamento CSS
- `index.html` - HTML principal
- `.gitignore` - Exclusões Git

**Código Fonte:**
```
src/
├── App.jsx                           # Componente principal
├── main.jsx                          # Entry point
├── index.css                         # Estilos globais
│
├── components/
│   ├── species/
│   │   ├── SpeciesPage.jsx          # CRUD completo
│   │   ├── SpeciesFormModal.jsx     # Modal de formulário
│   │   └── SpeciesTable.jsx         # Tabela listagem
│   │
│   ├── catches/
│   │   ├── CatchesPage.jsx          # CRUD completo
│   │   ├── CatchFormModal.jsx       # Modal com select de espécies
│   │   ├── CatchTable.jsx           # Tabela com botão de detalhes
│   │   └── CatchDetailModal.jsx     # Smart 1:1 Modal (CREATE/EDIT/DELETE)
│   │
│   ├── layout/
│   │   └── Sidebar.jsx              # Navegação com ícones (Fish, Anchor, MapPin)
│   │
│   └── ui/
│       ├── Modal.jsx                # Componente base de modal
│       ├── Toast.jsx                # Sistema de notificações
│       └── ConfirmDialog.jsx        # Dialog de confirmação
│
├── services/
│   ├── speciesService.js            # GET/POST/PUT/DELETE /species
│   ├── catchService.js              # GET/POST/PUT/DELETE /catches
│   ├── catchDetailService.js        # GET/POST/PUT/DELETE /catchdetails
│   └── axiosConfig.js               # Configuração global de interceptors
│
├── contexts/
│   └── ToastContext.jsx             # Estado global de toasts
│
├── hooks/
│   └── useToast.js                  # Hook customizado para Toast
│
└── utils/
    └── formatDate.js                # Utilitário de formatação de datas
```

---

## 🚀 Como Iniciar

### 1. **Instalar dependências**
```bash
cd /home/lucas/Documents/UFSC/UFSC-PROGRAMA/DesenvolvimentoWeb/TrabalhoFinalFront3
npm install
```

### 2. **Iniciar servidor de desenvolvimento**
```bash
npm run dev
```

A aplicação estará disponível em: **http://localhost:3000**

### 3. **Build para produção**
```bash
npm run build
```

---

## 📋 Funcionalidades Implementadas

### ✅ Espécies (Simple CRUD)
- Listar todas as espécies
- Criar nova espécie (commonName obrigatório)
- Editar espécie existente
- Deletar espécie (restrição: não pode ter capturas)
- Proteção contra erro 400 quando há capturas vinculadas

### ✅ Capturas (1:N Relationship)
- Listar todas as capturas com dados de espécie
- Criar nova captura com select de espécies
- Editar localização da captura
- Deletar captura (cascade delete automático de detalhes)
- Botão especial para abrir modal de detalhes

### ✅ Detalhes da Captura (1:1 Smart Modal)
- **Criar Modo**: Mostra banner amarelo "Modo Criação" quando não há detalhes
- **Editar Modo**: Permite editar detalhes existentes
- **Delete**: Botão especial para deletar apenas os detalhes
- Campos: peso, comprimento, tipo de isca, condição do tempo
- Tratamento automático do erro 404 (significa: crie detalhes)

### ✅ UX/UI
- System Toast (success, error, info, warning) com auto-close
- Modal reutilizável com footer customizável
- ConfirmDialog para ações perigosas
- Sidebar navegável com ícones de Lucide
- Responsivo com Tailwind CSS
- Buttons com estados loading desabilitados

### ✅ State Management
- Otimizado: Spread operators para ADD/UPDATE
- Sem re-fetch desnecessário após POST/PUT
- DELETE com filter automático
- Tratamento de erros global com mensagens do backend

---

## 🔗 Integração com Backend

**Base URL Configurada:** `http://localhost:5000/api`

### Endpoints Suportados:

**Species:**
```javascript
GET    /api/species           // Lista todas
GET    /api/species/{id}      // Detalhes com capturas
POST   /api/species           // Criar (commonName obrigatório)
PUT    /api/species/{id}      // Editar
DELETE /api/species/{id}      // Deletar (retorna 400 se tiver capturas)
```

**Catches:**
```javascript
GET    /api/catches           // Lista com species e details
GET    /api/catches/{id}      // Detalhes
POST   /api/catches           // Criar (não enviar catchDate)
PUT    /api/catches/{id}      // Editar
DELETE /api/catches/{id}      // Deletar (cascade no detail)
```

**CatchDetails:**
```javascript
GET    /api/catchdetails/catch/{catchId}  // Obter por catch (404 = sem detalhes)
GET    /api/catchdetails/{id}             // Obter por ID
POST   /api/catchdetails                  // Criar (retorna 409 se já existe)
PUT    /api/catchdetails/{id}             // Editar
DELETE /api/catchdetails/{id}             // Deletar
```

---

## 💡 Padrões Aplicados (Conforme Contextos)

✅ **State Optimization Pattern**
- Uso de spread operators nas atualizações
- Sem re-fetch após operações de escrita

✅ **1:N Relationship Pattern (Species → Catches)**
- Select de espécies dinâmico no CatchFormModal
- Proteção DELETE no backend (restrição)

✅ **1:1 Relationship Pattern (Catch ↔ CatchDetail)**
- Smart Modal com modo CREATE/EDIT/DELETE
- Banner alertando sobre modo de criação
- Tratamento de erro 404 como esperado

✅ **Error Handling**
- Extração de `error.response?.data?.error` do C#
- Exibição em Toasts com cores específicas
- Interceptor global de Axios

✅ **Layout Pattern**
- Sidebar navegável com ícones (Fish, Anchor, MapPin)
- Conteúdo principal responsivo
- Toast container fixo no canto superior direito

---

## 🔧 Próximos Passos (Opcional)

1. **Implementar página de Localizações** (placeholder criado em App.jsx)
2. **Adicionar filtros/busca** nas tabelas
3. **Implementar autenticação** (token JWT)
4. **Adicionar paginação** para grandes listas
5. **Implementar dark mode** com Tailwind
6. **Adicionar validações** mais granulares
7. **Melhorar performance** com React.memo() e useMemo()

---

## 📚 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|-----------|--------|-----|
| React | 18.2.0 | UI Framework |
| Vite | 4.4.0 | Build Tool |
| Tailwind CSS | 3.3.0 | Styling |
| Lucide React | 0.263.1 | Icons |
| Axios | 1.6.0 | HTTP Client |
| Node.js | Latest | Runtime |

---

## ⚠️ Notas Importantes

1. **CORS**: Já está habilitado no backend (wide-open policy)
2. **catchDate**: Gerado automaticamente pelo backend - NÃO enviar do frontend
3. **Validação**: Tratamento de 400/404/409 implementado
4. **Cascade Delete**: Deletar captura deleta seus detalhes automaticamente
5. **Erro 404 em CatchDetail**: Significa que não há detalhes - é modo de criação!

---

## 📞 Suporte

Qualquer dúvida na estrutura, consulte:
- Frontend Context: `/context/context-front.md`
- Backend Context: `/context/BACKEND_CONTEXT.md`
- README.md: Instruções de desenvolvimento
