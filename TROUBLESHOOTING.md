# 🔧 Guia de Troubleshooting - Fish Pokédex Frontend

## ❌ Erro: "Erro ao salvar espécie"

### 📋 Checklist de Diagnóstico

#### 1️⃣ Backend está rodando?

```bash
# Terminal 1 - Verificar se backend responde
curl -X GET http://localhost:5000/api/species

# Esperado: Array vazio [] ou lista de espécies
# Se der erro: "Connection refused" → Backend não está rodando
```

**Se backend não está rodando:**
```bash
cd /caminho/para/backend
dotnet run
# Deve mostrar: "Listening on http://localhost:5000"
```

---

#### 2️⃣ Frontend está fazendo a requisição?

Abra **DevTools (F12)** → **Console tab** e procure por:

```
✅ API Response: /species 201
❌ API Error: { url: '/species', method: 'post', status: 400, data: {...} }
```

**Significados:**
- ✅ `status: 201` → Sucesso! (Espécie criada)
- ❌ `status: 400` → Erro de validação (campo obrigatório faltando)
- ❌ `status: 500` → Erro no servidor
- ❌ `status: null` → Backend não responde (porta errada ou não rodando)

---

#### 3️⃣ Network Tab (Verificar requisição HTTP)

1. Abra **DevTools (F12)** → **Network tab**
2. Limpe o histórico (botão 🚫)
3. Tente criar uma espécie
4. Procure por requisição **`species` (POST)**
5. Clique e veja:
   - **Headers**: Método POST, URL correta, CORS headers
   - **Preview**: Resposta do servidor
   - **Response**: Mensagem de erro exata

---

#### 4️⃣ Erros Comuns

| Erro | Causa | Solução |
|------|-------|---------|
| `Network::ERR_CONNECTION_REFUSED` | Backend não está rodando | `dotnet run` no backend |
| `400 Bad Request` | Campo obrigatório vazio | Preencha "Nome Comum" |
| `409 Conflict` | Detalhes já existem (apenas CatchDetail) | Delete e recrie |
| `500 Internal Server Error` | Erro no banco de dados | Verifique logs do backend |
| `CORS error` | Problema com CORS | Verifique configuração backend |

---

### 🛠️ Passos de Debug Detalhado

#### Passo 1: Verificar Backend

```bash
# Terminal
curl -v http://localhost:5000/api/species

# Deve retornar:
# HTTP/1.1 200 OK
# [] ou [{...}]
```

**Se falhar**: Backend não está rodando. Execute:
```bash
cd /path/to/backend
dotnet run
```

---

#### Passo 2: Verificar Console do Frontend

```javascript
// No console do navegador (F12), digite:
console.log(require('axios').defaults.baseURL)
// Esperado: "http://localhost:5000/api"
```

---

#### Passo 3: Testar Requisição Manualmente

```javascript
// No console do navegador, copie e execute:
fetch('http://localhost:5000/api/species', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ commonName: 'Test Fish', scientificName: 'Test sp.' })
})
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Resultado esperado:**
```json
{
  "id": 1,
  "commonName": "Test Fish",
  "scientificName": "Test sp.",
  "catches": []
}
```

---

#### Passo 4: Verificar Logs do Backend

Procure no console do backend por mensagens como:

```
info: POST /api/species
info: Species created successfully: id=1
```

Ou erros:
```
error: Validation failed: commonName is required
error: Database error: connection timeout
```

---

### 🌐 Verificar CORS

Se vir erro como `Access to XMLHttpRequest blocked by CORS policy`:

1. **Verifique Backend** - CORS deve estar habilitado:
   ```csharp
   // No backend .NET
   builder.Services.AddCors(options => {
       options.AddPolicy("AllowAll", builder => {
           builder.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
       });
   });
   app.UseCors("AllowAll");
   ```

2. **Se ainda falhar**, teste com URL absoluta:
   ```javascript
   axios.post('http://localhost:5000/api/species', {...})
   ```

---

### 📊 Exemplo de Resposta Esperada

**Request:**
```json
POST /api/species
{
  "commonName": "Bass",
  "scientificName": "Micropterus salmoides"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "commonName": "Bass",
  "scientificName": "Micropterus salmoides",
  "catches": []
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "commonName is required"
}
```

---

### 🔍 Logs Úteis

O frontend já está configurado para logar:

```javascript
// Todos os requests bem-sucedidos
✅ API Response: /species 201

// Todos os erros
❌ API Error: {
  url: '/species',
  method: 'post',
  status: 400,
  statusText: 'Bad Request',
  data: { error: 'Validation failed' },
  message: 'Validation failed'
}
```

---

### 💡 Dicas Finais

1. **Sempre abra DevTools (F12)** - Console mostra tudo
2. **Limpe cache** - Ctrl+Shift+Delete ou Cmd+Shift+Delete
3. **Reinicie backend** - Se criou nova espécie, limpe banco de dados
4. **Verifique URLs** - Backend em `5000`, Frontend em `3000` ou `3001`
5. **Teste com curl** - Antes de testar na UI:
   ```bash
   curl -X POST http://localhost:5000/api/species \
     -H "Content-Type: application/json" \
     -d '{"commonName":"Bass"}'
   ```

---

### 📞 Checklist Final

- [ ] Backend rodando: `dotnet run`
- [ ] Frontend rodando: `npm run dev`
- [ ] DevTools aberto (F12)
- [ ] Console mostra logs
- [ ] Network tab mostrando requisições
- [ ] Backend respondendo em `http://localhost:5000/api/species`
- [ ] Formulário preenchido corretamente (Nome Comum obrigatório)

