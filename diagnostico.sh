#!/bin/bash

# 🔍 Fish Pokédex - Diagnóstico Completo
# Verifica backend, banco de dados, frontend, API endpoints

echo "🔍 Fish Pokédex - Diagnóstico Completo"
echo "======================================================"
echo ""

# Cores
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BACKEND_URL="http://localhost:5000"
API_URL="$BACKEND_URL/api"
FRONTEND_URL="http://localhost:3000"
SWAGGER_URL="$BACKEND_URL/swagger"

# ===== TESTES =====

echo "1️⃣ BACKEND"
echo "─────────────────────────────────────────────────────"

# Teste 1: Backend ativo
echo -n "Backend rodando em $BACKEND_URL... "
if curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL" | grep -q "200\|404"; then
    echo -e "${GREEN}✅ OK${NC}"
    BACKEND_OK=1
else
    echo -e "${RED}❌ FALHOU${NC}"
    BACKEND_OK=0
    echo -e "${RED}Erro: Backend não está respondendo${NC}"
    echo "Tente: cd /backend && dotnet run"
fi
echo ""

if [ $BACKEND_OK -eq 1 ]; then
    echo "2️⃣ SWAGGER (Documentação da API)"
    echo "─────────────────────────────────────────────────────"
    echo -e "Acesse no navegador: ${BLUE}$SWAGGER_URL${NC}"
    echo "Lá você pode testar todos os endpoints interativamente"
    echo ""

    echo "3️⃣ API ENDPOINTS"
    echo "─────────────────────────────────────────────────────"

    # Teste GET /species
    echo -n "GET /api/species... "
    SPECIES_HTTP=$(curl -s -o /tmp/species_response.json -w "%{http_code}" "$API_URL/species")
    if [ "$SPECIES_HTTP" = "200" ]; then
        echo -e "${GREEN}✅ HTTP $SPECIES_HTTP${NC}"
        SPECIES_COUNT=$(cat /tmp/species_response.json | grep -o '"id"' | wc -l)
        echo "   Espécies no banco: $SPECIES_COUNT"
        if [ $SPECIES_COUNT -eq 0 ]; then
            echo -e "   ${YELLOW}⚠️ Nenhuma espécie cadastrada${NC}"
        else
            echo "   Resposta: $(cat /tmp/species_response.json | head -c 100)..."
        fi
    else
        echo -e "${RED}❌ HTTP $SPECIES_HTTP${NC}"
        echo "   Erro: $(cat /tmp/species_response.json)"
    fi
    echo ""

    # Teste POST /species (criar teste)
    echo -n "POST /api/species (teste)... "
    TIMESTAMP=$(date +%s%N | cut -b1-13)
    CREATE_RESPONSE=$(curl -s -X POST "$API_URL/species" \
      -H "Content-Type: application/json" \
      -d "{\"commonName\":\"TestFish-$TIMESTAMP\",\"scientificName\":\"Test sp.\"}" \
      -w "\n%{http_code}")
    
    CREATE_HTTP=$(echo "$CREATE_RESPONSE" | tail -1)
    CREATE_BODY=$(echo "$CREATE_RESPONSE" | head -n -1)
    
    if [ "$CREATE_HTTP" = "201" ]; then
        echo -e "${GREEN}✅ HTTP $CREATE_HTTP (Criado com sucesso)${NC}"
        CREATED_ID=$(echo "$CREATE_BODY" | grep -o '"id":[0-9]*' | head -1 | grep -o '[0-9]*')
        echo "   ID Criado: $CREATED_ID"
    elif [ "$CREATE_HTTP" = "400" ]; then
        echo -e "${RED}❌ HTTP $CREATE_HTTP (Validação falhou)${NC}"
        echo "   Erro: $CREATE_BODY"
    else
        echo -e "${RED}❌ HTTP $CREATE_HTTP${NC}"
        echo "   Erro: $CREATE_BODY"
    fi
    echo ""

    # Teste GET /catches
    echo -n "GET /api/catches... "
    CATCHES_HTTP=$(curl -s -o /tmp/catches_response.json -w "%{http_code}" "$API_URL/catches")
    if [ "$CATCHES_HTTP" = "200" ]; then
        echo -e "${GREEN}✅ HTTP $CATCHES_HTTP${NC}"
        CATCHES_COUNT=$(cat /tmp/catches_response.json | grep -o '"id"' | wc -l)
        echo "   Capturas no banco: $CATCHES_COUNT"
    else
        echo -e "${RED}❌ HTTP $CATCHES_HTTP${NC}"
    fi
    echo ""

else
    echo "⚠️ Backend não está respondendo. Pulando testes de API..."
    echo ""
fi

echo "4️⃣ FRONTEND"
echo "─────────────────────────────────────────────────────"

# Teste Frontend
echo -n "Frontend rodando em $FRONTEND_URL... "
if curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" | grep -q "200"; then
    echo -e "${GREEN}✅ OK (porta 3000)${NC}"
elif curl -s -o /dev/null -w "%{http_code}" "http://localhost:3001" | grep -q "200"; then
    echo -e "${GREEN}✅ OK (porta 3001)${NC}"
else
    echo -e "${RED}❌ Nenhum frontend encontrado${NC}"
    echo "Tente: npm run dev"
fi
echo ""

echo "5️⃣ CONFIGURAÇÃO"
echo "─────────────────────────────────────────────────────"
echo "Backend URL: $BACKEND_URL"
echo "API Base: $API_URL"
echo "Swagger UI: $SWAGGER_URL"
echo "Frontend (3000): http://localhost:3000"
echo "Frontend (3001): http://localhost:3001"
echo ""

echo "════════════════════════════════════════════════════════"
echo ""
echo "📋 RESUMO:"
echo ""

if [ $BACKEND_OK -eq 1 ]; then
    echo -e "${GREEN}✅ Backend OK${NC}"
    echo "✅ APIs respondendo"
    echo "📖 Swagger: http://localhost:5000/swagger"
    echo ""
    echo "Próximos passos:"
    echo "1. Abra o Swagger no navegador"
    echo "2. Teste GET /api/species"
    echo "3. Se tiver dados, veja no banco"
    echo "4. Se não tiver dados, crie via Swagger"
    echo "5. Recarregue o frontend"
else
    echo -e "${RED}❌ Backend NÃO OK${NC}"
    echo "Execute no terminal: cd /backend && dotnet run"
fi

echo ""
echo "💡 Para mais detalhes, consulte ACESSAR_BANCO_DADOS.md"
echo "════════════════════════════════════════════════════════"
