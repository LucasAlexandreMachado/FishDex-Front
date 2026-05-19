# 🎣 Fish Pokédex - Guia de Início Rápido

## ✅ Status do Projeto

Frontend React/Vite **completamente criado** e **pronto para usar**.

---

## 🚀 Iniciando (Passo a Passo)

### Terminal 1: Inicie o Backend

```bash
cd /caminho/para/seu/backend/project
dotnet run
```

**Esperado:**
```
Listening on http://localhost:5238
```

### Terminal 2: Inicie o Frontend

```bash
cd /home/lucas/Documents/UFSC/UFSC-PROGRAMA/DesenvolvimentoWeb/TrabalhoFinalFront3
npm run dev
```

**Esperado:**
```
VITE v8.0.8 ready in 246 ms
Local:   http://localhost:3001/
```

### Terminal 3: Abra no Navegador

```bash
# Ou manualmente acesse:
http://localhost:3001
```

---

## 🔴 Se Vir "Erro ao salvar espécie"

### ✅ Passo 1: Verificar Backend

```bash
curl http://localhost:5238/api/species
# Esperado: [] ou [{...}]
# Se der erro: Backend não está rodando!
```

### ✅ Passo 2: Ver o Erro Real

1. Abra **DevTools (F12)** no navegador
2. Vá para **Console tab**
3. Tente salvara espécie novamente
4. Procure por logs com `❌ API Error:`

```
❌ API Error: {
  url: '/species',
  method: 'post',
  status: null,  ← Aqui está seu erro!
  message: 'Network Error: Backend não está respondendo em http://localhost:5238'
}
```

### ✅ Passo 3: Resolver

| Mensagem de Erro | Solução |
|------------------|---------|
| `status: null, Network Error` | Backend não está rodando → `dotnet run` |
| `status: 400, Bad Request` | Preencheu o formulário corretamente? |
| `status: 500` | Erro no servidor → Verifique logs do backend |
| `CORS policy error` | Verifique CORS no backend |

---

## 📊 Testes Manuais (Curl)

### Criar Espécie

```bash
curl -X POST http://localhost:5238/api/species \
  -H "Content-Type: application/json" \
  -d '{"commonName":"Bass","scientificName":"Micropterus salmoides"}'

# Resposta esperada (201):
# {"id":1,"commonName":"Bass","scientificName":"Micropterus salmoides","catches":[]}
```

### Listar Espécies

```bash
curl http://localhost:5238/api/species

# Resposta esperada:
# [{"id":1,"commonName":"Bass",...}]
```

### Criar Captura

```bash
curl -X POST http://localhost:5238/api/catches \
  -H "Content-Type: application/json" \
  -d '{"location":"Lake Superior","speciesId":1}'

# Resposta esperada (201):
# {"id":1,"location":"Lake Superior","speciesId":1,"catchDate":"2026-04-09T...","species":{...}}
```

---

## 📁 Estrutura do Projeto

```
TrabalhoFinalFront3/
├── src/
│   ├── components/
│   │   ├── species/          ← Espécies CRUD
│   │   ├── catches/          ← Capturas + Detalhes 1:1
│   │   ├── layout/           ← Sidebar
│   │   └── ui/               ← Modal, Toast, ConfirmDialog
│   ├── services/             ← API (speciesService, catchService, etc)
│   ├── contexts/             ← ToastContext (notificações)
│   ├── hooks/                ← useToast
│   ├── utils/                ← formatDate
│   ├── App.jsx               ← App principal
│   └── main.jsx
├── package.json
├── vite.config.js
├── tailwind.config.js
├── README.md                 ← Instruções detalhadas
├── ESTRUTURA_CRIADA.md       ← O que foi criado
├── TROUBLESHOOTING.md        ← Debug completo
└── check-backend.sh          ← Script de verificação
```

---

## 🎯 Checklist de Início

- [ ] Backend rodando em `http://localhost:5238`
- [ ] Frontend rodando em `http://localhost:3001`
- [ ] Abri DevTools (F12) no navegador
- [ ] Consigo acessar `http://localhost:3001` no navegador
- [ ] Consigo ver a interface com Sidebar
- [ ] Clicando em "Nova Espécie" abre um modal
- [ ] Preenchendo e clicando "Salvar" → Sucesso! ✅

---

## 🛠️ Scripts Úteis

```bash
# Build para produção
npm run build

# Preview do build
npm run preview

# Verificar backend está ok
./check-backend.sh

# Limpar cache e reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentação Completa

- **[README.md](README.md)** - Setup, estrutura, features
- **[ESTRUTURA_CRIADA.md](ESTRUTURA_CRIADA.md)** - Detalhes dos 20+ arquivos
- **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Debug avançado
- **[BACKEND_CONTEXT.md](../context/BACKEND_CONTEXT.md)** - API docs do backend
- **[context-front.md](../context/context-front.md)** - Padrões de frontend

---

## 💬 Resumo Rápido

✅ **Frontend criado**: React 18 + Vite + Tailwind  
✅ **3 páginas**: Espécies, Capturas, Localizações (placeholder)  
✅ **APIs integradas**: Species, Catches, CatchDetails  
✅ **State management**: Otimizado com spread operators  
✅ **1:1 Smart Modal**: CatchDetailModal com CREATE/EDIT/DELETE  
✅ **Notificações**: Sistema de Toast global  
✅ **Responsivo**: Mobile-friendly com Tailwind  

---

## ❓ Próximos Passos

1. **Debug se der erro** → Veja [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
2. **Está funcionando?** → Implemente página de Localizações
3. **Quer melhorar?** → Adicione filtros, paginação, autenticação

---

**Criado em**: 2026-04-09  
**Versão**: 1.0.0  
**Status**: ✅ Pronto para uso
