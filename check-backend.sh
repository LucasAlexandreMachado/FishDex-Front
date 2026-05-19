#!/bin/bash

# 🟢 Fish Pokédex - Backend Health Check
# Verifica se o backend está respondendo corretamente

echo "🔍 Testando conexão com Backend Fish Pokédex..."
echo ""

BACKEND_URL="http://localhost:5238/api"

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar se backend está rodando
echo "1️⃣ Verificando se backend está rodando..."
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/species" | grep -q "200\|304"; then
    echo -e "${GREEN}✅ Backend está respondendo${NC}"
else
    echo -e "${RED}❌ Backend não está respondendo${NC}"
    echo "   Execute: cd /path/to/backend && dotnet run"
    exit 1
fi
echo ""

# 2. Testar GET /species
echo "2️⃣ Testando GET /species..."
SPECIES_RESPONSE=$(curl -s "$BACKEND_URL/species")
if echo "$SPECIES_RESPONSE" | grep -q '\['; then
    echo -e "${GREEN}✅ GET /species funcionando${NC}"
    echo "   Resposta: $SPECIES_RESPONSE"
else
    echo -e "${RED}❌ GET /species falhou${NC}"
fi
echo ""

# 3. Testar POST /species (criar espécie de teste)
echo "3️⃣ Testando POST /species..."
TIMESTAMP=$(date +%s)
CREATE_RESPONSE=$(curl -s -X POST "$BACKEND_URL/species" \
  -H "Content-Type: application/json" \
  -d "{\"commonName\":\"TestFish-$TIMESTAMP\",\"scientificName\":\"Test sp.\"}")

if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
    SPECIES_ID=$(echo "$CREATE_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
    echo -e "${GREEN}✅ POST /species funcionando${NC}"
    echo "   ID criado: $SPECIES_ID"
    echo "   Resposta: $CREATE_RESPONSE"
else
    echo -e "${RED}❌ POST /species falhou${NC}"
    echo "   Resposta: $CREATE_RESPONSE"
fi
echo ""

# 4. Testar GET /species/{id}
if [ ! -z "$SPECIES_ID" ]; then
    echo "4️⃣ Testando GET /species/$SPECIES_ID..."
    GET_RESPONSE=$(curl -s "$BACKEND_URL/species/$SPECIES_ID")
    if echo "$GET_RESPONSE" | grep -q "$SPECIES_ID"; then
        echo -e "${GREEN}✅ GET /species/{id} funcionando${NC}"
    else
        echo -e "${RED}❌ GET /species/{id} falhou${NC}"
    fi
    echo ""
fi

# 5. Testar GET /catches
echo "5️⃣ Testando GET /catches..."
CATCHES_RESPONSE=$(curl -s "$BACKEND_URL/catches")
if echo "$CATCHES_RESPONSE" | grep -q '\['; then
    echo -e "${GREEN}✅ GET /catches funcionando${NC}"
else
    echo -e "${RED}❌ GET /catches falhou${NC}"
fi
echo ""

# 6. Resumo
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Backend está pronto!${NC}"
echo ""
echo "Próximas ações:"
echo "1. Frontend: npm run dev"
echo "2. Navegue para: http://localhost:3000 (ou 3001)"
echo "3. Teste a criação de espécies"
echo ""
echo "Para troubleshooting, veja: TROUBLESHOOTING.md"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
