# 🚀 Passo a Passo: Verificar e Debugar Banco de Dados

## ⚡ Quick Start (5 Minutos)

### Passo 1: Abrir Swagger (RECOMENDADO)

```
Navegador: http://localhost:5238/swagger
```

**Você verá:**
```
┌─────────────────────────────────────────┐
│ /api/species                            │
│ GET - List all species                  │
│ POST - Create new species               │
│                                         │
│ /api/catches                            │
│ GET - List all catches                  │
│ POST - Create new catch                 │
│                                         │
│ /api/catchdetails                       │
│ GET/POST/PUT/DELETE                     │
└─────────────────────────────────────────┘
```

---

### Passo 2: Testar GET /species via Swagger

1. Procure `GET /api/species`
2. Clique nele
3. Clique no botão azul **"Try it out"**
4. Clique no botão verde **"Execute"**
5. Veja a resposta:

**Se retorna 200 com dados:**
```json
[
  {
    "id": 1,
    "commonName": "Bass",
    "scientificName": "Micropterus salmoides",
    "catches": []
  }
]
```
✅ Banco tem dados!

**Se retorna 200 vazio:**
```json
[]
```
⚠️ Banco está vazio, precisa criar dados

**Se retorna 500:**
```json
{
  "error": "Database connection failed",
  "detail": "Cannot connect to localhost:5432"
}
```
❌ Banco offline ou desconectado

---

### Passo 3: Interpretar Erros

| HTTP Code | Significado | Ação |
|-----------|-------------|------|
| **200** | ✅ Sucesso - dados retornados | Continue para o frontend |
| **201** | ✅ Criado com sucesso | Dados foram salvos no banco |
| **204** | ✅ Sucesso sem conteúdo | (Normalmente em PUT) |
| **400** | ❌ Validação falhou | Ver mensagem de erro |
| **404** | ❌ Não encontrado | Endpoint errado |
| **500** | ❌ Erro no servidor/banco | Ver mensagem de erro |

---

## 🔧 Testes Detalhados

### Teste A: Criar Espécie via Swagger

**URL:** `http://localhost:5238/swagger`

**Passos:**
1. Procure `POST /api/species`
2. Clique em "Try it out"
3. Veja a caixa de entrada (Request body):
   ```json
   {
     "commonName": "string",
     "scientificName": "string"
   }
   ```
4. Substitua por:
   ```json
   {
     "commonName": "Truta",
     "scientificName": "Salmo trutta"
   }
   ```
5. Clique "Execute"

**Esperado:**
```
201 Created
Response:
{
  "id": 2,
  "commonName": "Truta",
  "scientificName": "Salmo trutta"
}
```

---

### Teste B: Verificar Banco com curl

```bash
# Testar GET /species
curl http://localhost:5238/api/species

# Esperado:
# [{...}, {...}]  ou  []

# Testar POST /species
curl -X POST http://localhost:5238/api/species \
  -H "Content-Type: application/json" \
  -d '{"commonName":"Pike","scientificName":"Esox lucius"}'

# Esperado:
# {"id":3,"commonName":"Pike",...}
```

---

### Teste C: Acessar Banco Diretamente

#### PostgreSQL (mais comum)

```bash
# Conectar
psql -U postgres -h localhost -d fish_pokedex

# Ver tabelas
\dt

# Ver dados
SELECT * FROM "Species";
SELECT COUNT(*) FROM "Species";

# Sair
\q
```

#### SQLite

```bash
# Conectar (arquivo na pasta do backend)
sqlite3 fish_pokedex.db

# Ver tabelas
.tables

# Ver dados
SELECT * FROM Species;
SELECT COUNT(*) FROM Species;

# Sair
.quit
```

---

## 🎯 Cenários e Soluções

### Cenário 1: GET /species retorna 200 vazio `[]`

**Problema:** Banco conectado mas sem dados

**Solução:**
1. Crie dados via Swagger (POST /species)
2. Ou execute SQL:
   ```sql
   INSERT INTO "Species" (commonName, scientificName) 
   VALUES ('Bass', 'Micropterus salmoides');
   ```
3. Recarregue o frontend

---

### Cenário 2: GET /species retorna 500

**Problema:** Erro no servidor ou banco desconectado

**Solução:**
1. Verifique logs do backend (console do terminal)
2. Procure por mensagens como:
   - `Exception: Connection timeout`
   - `Database error: `
3. Verifique appsettings.json ConnectionString
4. Reinicie o backend: `dotnet run`

---

### Cenário 3: Frontend diz "Erro ao salvar espécie"

**Diagnóstico:**

1. **Abra DevTools (F12) → Console**
2. Procure por: `❌ API Error:`
3. Note o `status` (400, 500, null, etc)

**Se status = null:**
- Backend não está rodando
- Execute: `dotnet run`

**Se status = 500:**
- Erro no servidor
- Veja logs do backend

**Se status = 400:**
- Validação falhou
- Veja mensagem de erro
- Preencheu o formulário corretamente?

---

## 📊 Checklist: Tudo Funcionando

- [ ] Backend rodando: `http://localhost:5238` → "Listening on..."
- [ ] Swagger acessível: `http://localhost:5238/swagger`
- [ ] GET /api/species → HTTP 200
- [ ] Banco tem dados (ou está vazio, sem erro)
- [ ] POST /api/species → HTTP 201 (criar)
- [ ] Frontend rodando: `http://localhost:3001`
- [ ] Carregar espécies no frontend funciona
- [ ] Criar espécie no frontend funciona

---

## 🆘 Troubleshooting Rápido

### Backend não responde?
```bash
# Verificar porta
lsof -i :5238

# Se ocupada, matar processo
kill -9 <PID>

# Reiniciar
dotnet run
```

### Banco desconectado?
```bash
# Verificar arquivo appsettings.json
# Procure por ConnectionStrings

# Se PostgreSQL, verificar PostgreSQL rodando:
sudo systemctl status postgresql

# Se SQLite, verificar arquivo existe:
ls -la fish_pokedex.db
```

### Frontend não carrega dados?
```bash
# Abrir DevTools (F12)
# Console tab → Procurar "❌ API Error:"
# Network tab → Procurar POST /species
# Ver status code e response
```

---

## 📞 Resumo: Passos Definitivos

### 1. Verificar Backend
```
http://localhost:5238/swagger
```
Tente GET /species → Veja resposta

### 2. Se erro, verificar banco
```bash
psql -U postgres -h localhost -d fish_pokedex
SELECT COUNT(*) FROM "Species";
```

### 3. Se vazio, criar dados
```
http://localhost:5238/swagger
POST /species → Criar "Bass"
```

### 4. Recarregar frontend
```
http://localhost:3001
Clique "Nova Espécie"
Deve aparecer o Bass criado
```

---

**Qual é o seu próximo passo?**

1. ✅ Abra `http://localhost:5238/swagger`
2. ✅ Tente GET /species
3. ✅ Me diga:
   - Status code (200, 500, etc)?
   - Response (dados ou erro)?
4. ✅ Continuamos daqui
