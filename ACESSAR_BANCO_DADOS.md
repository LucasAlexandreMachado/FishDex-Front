# 🔍 Como Acessar o Banco de Dados - Fish Pokédex

## 🌐 Acessar Backend pelo Navegador

### 1️⃣ **Swagger UI (Recomendado)**

Digite no navegador:
```
http://localhost:5000/swagger
```

**O que você vê:**
- ✅ Documentação interativa de TODAS as APIs
- ✅ Interface para testar endpoints
- ✅ Modelos de dados esperados
- ✅ Respostas de sucesso e erro

**Como testar uma API no Swagger:**
1. Abra `http://localhost:5000/swagger`
2. Procure por `/api/species`
3. Clique em **GET** (para listar)
4. Clique no botão **"Try it out"**
5. Clique em **"Execute"**
6. Veja a resposta em tempo real

---

### 2️⃣ **OpenAPI/JSON**

Se quiser ver a especificação completa:
```
http://localhost:5000/swagger/v1/swagger.json
```

---

## 🗄️ Acessar Banco de Dados Diretamente

Depende da versão do seu backend. Verifique qual é usada:

### **Se usando PostgreSQL (mais comum):**

#### Opção A: DBeaver (GUI recomendada)
1. Download: https://dbeaver.io/
2. Criar nova conexão:
   - Type: PostgreSQL
   - Host: localhost
   - Port: 5432 (padrão)
   - Database: fish_pokedex (ou seu nome)
   - User: postgres
   - Password: (verificar no appsettings.json do backend)
3. Conectar e explorar tabelas

#### Opção B: pgAdmin (Web)
```
Acesso: http://localhost:5050
User: admin@pgadmin4.com
Password: admin
```

#### Opção C: Terminal psql
```bash
# Conectar ao PostgreSQL
psql -U postgres -h localhost -d fish_pokedex

# Listar tabelas
\dt

# Ver espécies
SELECT * FROM "Species";

# Ver capturas
SELECT * FROM "Catches";

# Ver detalhes de captura
SELECT * FROM "CatchDetails";
```

---

### **Se usando SQL Server:**

#### Opção A: SQL Server Management Studio (SSMS)
```
Server: localhost
Authentication: Windows ou SQL Server
Database: fish_pokedex
```

#### Opção B: Azure Data Studio
```
Connection: Server localhost
Database: fish_pokedex
```

#### Opção C: Terminal sqlcmd
```bash
sqlcmd -S localhost -U sa -P YourPassword
> USE fish_pokedex
> SELECT * FROM Species
```

---

### **Se usando SQLite (mais simples):**

O arquivo é um simples arquivo `.db` ou `.sqlite`

#### Opção A: SQLite Browser
1. Download: https://sqlitebrowser.org/
2. Open: `fish_pokedex.db` (procure no projeto backend)
3. Explore as abas

#### Opção C: Terminal
```bash
sqlite3 fish_pokedex.db
sqlite> .tables
sqlite> SELECT * FROM Species;
```

---

## 🔧 Onde encontrar a Configuração do Banco

**No backend .NET, abra:**
```
appsettings.json
ou
appsettings.Development.json
```

**Procure por `ConnectionStrings`:**

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Port=5432;Database=fish_pokedex;User Id=postgres;Password=postgres;"
  }
}
```

**Daqui você extrai:**
- `Server`: localhost
- `Port`: 5432
- `Database`: fish_pokedex
- `User Id`: postgres
- `Password`: postgres

---

## 🧪 Teste de Debug Passo a Passo

### Passo 1: Verificar se Backend Responde

```bash
# Terminal
curl -X GET http://localhost:5000/api/species -v

# Esperado:
# HTTP/1.1 200 OK
# Content-Type: application/json
# []  ou  [{id: 1, commonName: "Bass", ...}]
```

**Se der erro:**
- `Connection refused` → Backend não está rodando
- `404 Not Found` → URL errada
- `500 Internal Server Error` → Erro no servidor ou banco

### Passo 2: Acessar Swagger

```
http://localhost:5000/swagger
```

**Tente GET /species:**
1. Clique em "Try it out"
2. Clique em "Execute"
3. Veja a resposta exata (200, 400, 500, etc)

### Passo 3: Ver Erro Real

Se receber erro (ex: 500), a resposta mostará:

```json
{
  "error": "Database connection timeout",
  "detail": "Cannot connect to localhost:5432"
}
```

Isso te diz exatamente qual é o problema!

### Passo 4: Verificar Banco Direto

```bash
# Se PostgreSQL
psql -U postgres -h localhost -d fish_pokedex

# Se SQLite
sqlite3 fish_pokedex.db

# Se SQL Server
sqlcmd -S localhost -U sa -P sa_password
```

**Sinta-se livre para rodar:**
```sql
-- Listar todas as tabelas
SELECT * FROM information_schema.tables;

-- Contar espécies
SELECT COUNT(*) FROM "Species";

-- Ver todas as espécies
SELECT * FROM "Species";
```

---

## 🐛 Possíveis Problemas e Soluções

| Erro | Causa | Solução |
|------|-------|---------|
| `Connection refused` | Backend não rodando | `dotnet run` |
| `HTTP 500` | Banco desconectado | Verificar appsettings.json |
| `HTTP 400` | Validação falhou | Ver mensagem de erro |
| `HTTP 404` | Endpoint inexistente | Verificar URL em context-front.md |
| Tabelas vazias | Nenhum dado inserido | Inserir dados via Swagger ou SQL |
| `CORS error` | CORS não configurado | Já está abilitado no contexto |

---

## 📊 Exemplo de Teste Completo

### 1. Testar via Swagger

```
URL: http://localhost:5000/swagger
Endpoint: GET /api/species
Response: 200 OK, []
```

### 2. Testar via cURL

```bash
curl http://localhost:5000/api/species
# Esperado: []
```

### 3. Criar Espécie via Swagger

```
POST /api/species
Body: {
  "commonName": "Bass",
  "scientificName": "Micropterus salmoides"
}
Response: 201 Created, {id: 1, commonName: "Bass", ...}
```

### 4. Verificar no Banco

```bash
# PostgreSQL
psql -c "SELECT * FROM \"Species\";"
# Esperado: 1 row (o Bass que criamos)
```

### 5. Testar Frontend

```
http://localhost:3001
Clique em "Nova Espécie"
Veja se o Bass aparece
```

---

## 🔑 Checklist: Banco de Dados

- [ ] Backend rodando (`dotnet run`)
- [ ] Swagger acessível (`http://localhost:5000/swagger`)
- [ ] GET /species retorna 200
- [ ] Consigo ver as tabelas no banco (tableNames: Species, Catches, CatchDetails)
- [ ] Banco tem dados ou está vazio?
- [ ] appsettings.json tem ConnectionString correta

---

## 🎯 Próximos Passos

1. **Acessar Swagger**: `http://localhost:5000/swagger`
2. **Testar GET /species**: Clique em "Try it out" → "Execute"
3. **Ver resposta**: Sucesso (200) ou erro (qual código?)
4. **Se erro**: Procure mensagem de erro na resposta
5. **Se sucesso**: Dados estão no banco
6. **Recarregar frontend**: `http://localhost:3001`

---

## 💡 Dica: Use Swagger Para Tudo

Não precisa de curl! Swagger é muito melhor:

```
http://localhost:5000/swagger
```

⭐ Clique em qualquer endpoint
⭐ Veja modelo esperado
⭐ Clique "Try it out"
⭐ Preencha campos
⭐ Clique "Execute"
⭐ Veja resultado em tempo real

Perfeito para debugar!

---

**Qual é o próximo passo?**
1. Abra `http://localhost:5000/swagger`
2. Me diga qual é o **status code** que recebe em GET /species
3. Me mostre a **resposta exata** (sucesso ou erro)
