#!/bin/bash

# ============================================================================
# SCRIPT DE INTEGRACIÓN - FASE 1
# Actualizar origin/master con cambios de HEAD actual
# ============================================================================

set -e  # Exit on error

echo "============================================================================"
echo "🚀 FASE 1: CONSOLIDACIÓN DE CAMBIOS EN MASTER"
echo "============================================================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Variables
BACKUP_BRANCH="backup-before-integration-$(date +%Y%m%d-%H%M%S)"
CURRENT_BRANCH=$(git branch --show-current)

echo "📋 Información Inicial:"
echo "  - Rama actual: $CURRENT_BRANCH"
echo "  - Rama de respaldo: $BACKUP_BRANCH"
echo ""

# Step 1: Verificar estado limpio
echo "✅ Paso 1/6: Verificando estado del repositorio..."
if [[ -n $(git status --porcelain) ]]; then
    echo -e "${RED}❌ ERROR: Hay cambios sin commitear${NC}"
    echo "Por favor, commitea o stashea los cambios antes de continuar"
    git status --short
    exit 1
fi
echo -e "${GREEN}✓ Repositorio limpio${NC}"
echo ""

# Step 2: Crear rama de respaldo
echo "✅ Paso 2/6: Creando rama de respaldo..."
git branch "$BACKUP_BRANCH"
echo -e "${GREEN}✓ Rama de respaldo creada: $BACKUP_BRANCH${NC}"
echo ""

# Step 3: Fetch latest from origin
echo "✅ Paso 3/6: Obteniendo últimos cambios de origin..."
git fetch origin
echo -e "${GREEN}✓ Fetch completado${NC}"
echo ""

# Step 4: Checkout/crear master local
echo "✅ Paso 4/6: Preparando rama master local..."
if git show-ref --verify --quiet refs/heads/master; then
    echo "  Master local existe, haciendo checkout..."
    git checkout master
    git reset --hard origin/master
else
    echo "  Master local no existe, creando desde origin/master..."
    git checkout -b master origin/master
fi
echo -e "${GREEN}✓ Master local preparado${NC}"
echo ""

# Step 5: Merge de HEAD actual
echo "✅ Paso 5/6: Integrando cambios..."
echo "  Mergeando desde: $CURRENT_BRANCH"
echo ""

MERGE_MESSAGE="chore: integrate PRs #15, #14, #12 and improvements into master

This merge consolidates the following changes:
- PR #15: Interactive landing page for Manda2
- PR #14: Integration of blackbox issue #13
- PR #12: Comprehensive Vercel deployment documentation
- Geocoding improvements with fallback system
- Visual consistency improvements (sesion4)
- Package-lock.json updates

Total: 8 commits, 3,097 insertions(+), 111 deletions(-)

Closes #13"

if git merge "$CURRENT_BRANCH" --no-ff -m "$MERGE_MESSAGE"; then
    echo -e "${GREEN}✓ Merge exitoso${NC}"
else
    echo -e "${RED}❌ ERROR: Conflictos de merge detectados${NC}"
    echo "Por favor, resuelve los conflictos manualmente y ejecuta:"
    echo "  git merge --continue"
    echo ""
    echo "O para abortar:"
    echo "  git merge --abort"
    echo "  git checkout $CURRENT_BRANCH"
    exit 1
fi
echo ""

# Step 6: Verificar resultado
echo "✅ Paso 6/6: Verificando resultado..."
echo ""
echo "📊 Últimos 10 commits en master:"
git log --oneline -10
echo ""
echo "📈 Diferencias con origin/master:"
git diff --stat origin/master
echo ""

# Resumen
echo "============================================================================"
echo -e "${GREEN}✅ FASE 1 COMPLETADA EXITOSAMENTE${NC}"
echo "============================================================================"
echo ""
echo "📋 Resumen:"
echo "  ✓ Rama de respaldo creada: $BACKUP_BRANCH"
echo "  ✓ Master local actualizado con 8 commits"
echo "  ✓ Merge completado sin conflictos"
echo ""
echo "🎯 Próximos pasos:"
echo "  1. Revisar los cambios: git log --oneline -10"
echo "  2. Verificar que todo está correcto"
echo "  3. Push a origin/master: git push origin master"
echo ""
echo "⚠️  IMPORTANTE: Antes de hacer push, verifica que:"
echo "  - Los commits son correctos"
echo "  - No hay errores en el código"
echo "  - Los tests pasan"
echo ""
echo "🔄 Para hacer rollback si es necesario:"
echo "  git reset --hard $BACKUP_BRANCH"
echo ""
echo "============================================================================"
