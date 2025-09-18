# CRUSH Startup Protocol - Mandatory First Action

## 🚀 PROTOCOLO OBLIGATORIO AL INICIAR

**ATENCIÓN:** Todo agente que inicie en este directorio DEBE ejecutar este protocolo como primera acción antes de cualquier otra tarea.

---

## 📋 Checklist de Inicio Obligatorio

### ✅ PASO 1: Verificar Estado de Fallback
```bash
# Verificar si existe flag de fallback activo
if [ -f "FALLBACK_TRIGGER.flag" ]; then
    echo "🚨 FALLBACK ACTIVO - Prioridad máxima"
    cat FALLBACK_TRIGGER.flag
    echo "➡️ ACCIÓN: Leer FALLBACK_REPORT.md inmediatamente"
else
    echo "✅ No hay fallbacks activos"
fi
```

### ✅ PASO 2: Leer Estado del Proyecto
```bash
# Leer archivos de estado obligatorios
cat SESSION_TRACKER.md | head -20
echo "---"
cat FALLBACK_REPORT.md | head -10
```

### ✅ PASO 3: Verificar Último Estado del Sistema
```bash
# Verificar build status
cd frontend && npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend build: SUCCESS"
else
    echo "❌ Frontend build: FAILED - POSIBLE FALLBACK REQUERIDO"
fi

# Verificar backend
cd ../backend && npm test > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend tests: PASSED"
else
    echo "❌ Backend tests: FAILED - POSIBLE FALLBACK REQUERIDO"
fi
```

### ✅ PASO 4: Determinar Situación Actual

#### Escenario A: Fallback Activo 🚨
```yaml
SI existe FALLBACK_TRIGGER.flag:
  1. LEER completamente FALLBACK_REPORT.md
  2. IDENTIFICAR nivel de escalación requerido
  3. VERIFICAR si soy el modelo adecuado para resolución
  4. SI soy adecuado: PROCEDER con resolución
  5. SI NO soy adecuado: REPORTAR y SOLICITAR escalación
  6. COMPLETAR resolución antes de continuar workflow normal
```

#### Escenario B: Sistema Estable ✅
```yaml
SI NO existe fallback activo:
  1. IDENTIFICAR sesión actual desde SESSION_TRACKER.md
  2. VERIFICAR prerrequisitos completados
  3. INFORMAR estado actual al usuario
  4. PROCEDER con próxima tarea según workflow
```

#### Escenario C: Estado Indeterminado ⚠️
```yaml
SI hay builds fallidos pero no hay fallback activo:
  1. EJECUTAR diagnóstico completo
  2. DETERMINAR si requiere fallback
  3. ACTIVAR fallback si necesario
  4. PROCEDER según corresponda
```

---

## 🤖 Template de Reporte de Inicio

### Para Reportar al Usuario
```markdown
# Estado del Proyecto YEGA - [TIMESTAMP]

## 🔍 Verificación de Sistema
- Fallback Status: [ACTIVO/INACTIVO]
- Build Status: [SUCCESS/FAILED]
- Test Status: [PASSED/FAILED]
- Sesión Actual: [SESIÓN X: Nombre]

## 📊 Situación Actual
[Descripción clara del estado actual]

## ➡️ Próxima Acción Recomendada
[Acción específica que debería tomarse]

## ⚠️ Alertas o Consideraciones
[Cualquier problema o consideración importante]
```

---

## 🛠️ Scripts de Diagnóstico Automático

### Auto-Diagnóstico Completo
```bash
#!/bin/bash
# auto_diagnosis.sh

echo "🔍 YEGA System Diagnosis - $(date)"
echo "=================================="

# Check fallback status
if [ -f "FALLBACK_TRIGGER.flag" ]; then
    echo "🚨 CRITICAL: Active fallback detected"
    echo "Type: $(cat FALLBACK_TRIGGER.flag)"
    echo "Report: Check FALLBACK_REPORT.md"
    echo "Action: Immediate resolution required"
    exit 1
fi

# Check build status
echo "📦 Checking build status..."
cd frontend
if npm run build > build.log 2>&1; then
    echo "✅ Frontend build: SUCCESS"
else
    echo "❌ Frontend build: FAILED"
    echo "Last 5 errors:"
    tail -5 build.log
    CRITICAL_ERROR=1
fi

# Check backend tests
echo "🧪 Checking backend tests..."
cd ../backend
if npm test > test.log 2>&1; then
    echo "✅ Backend tests: PASSED"
else
    echo "❌ Backend tests: FAILED"
    echo "Test failures:"
    tail -5 test.log
    CRITICAL_ERROR=1
fi

# Check API health
echo "🌐 Checking API health..."
if curl -s -f http://localhost:5000/api/health > /dev/null; then
    echo "✅ Backend API: HEALTHY"
else
    echo "❌ Backend API: UNREACHABLE"
    CRITICAL_ERROR=1
fi

# Check session status
echo "📋 Checking session status..."
CURRENT_SESSION=$(grep -A1 "🔄 EN PROGRESO" SESSION_TRACKER.md | head -2)
if [ -n "$CURRENT_SESSION" ]; then
    echo "📍 Current session: $CURRENT_SESSION"
else
    PENDING_SESSION=$(grep -A1 "🔄 PENDIENTE" SESSION_TRACKER.md | head -2)
    if [ -n "$PENDING_SESSION" ]; then
        echo "⏸️ Next pending: $PENDING_SESSION"
    else
        echo "✅ All sessions completed or unknown status"
    fi
fi

# Final status
if [ "$CRITICAL_ERROR" = "1" ]; then
    echo "🚨 CRITICAL ERRORS DETECTED - Consider activating fallback"
    exit 1
else
    echo "✅ System status: Healthy"
    exit 0
fi
```

---

## 📖 Instrucciones Específicas por Modelo

### Claude 3.5 Sonnet (Modelo Principal según modelos_list.csv)
```yaml
Especializaciones Principales:
  - Repartidor/Pedidos.jsx ($150-250)
  - Cliente/Dashboard.jsx ($100-150) 
  - Visual Consistency ($95-155)
  - Security + PWA + CI/CD ($100-160)
  - Performance + Documentation ($70-125)

Capacidades de Fallback:
  - Resolución de fallbacks Nivel 1
  - Análisis arquitectural completo
  - WebSocket y geolocation debugging
  - Security audit y performance optimization

Primera Acción:
  1. Verificar si la tarea está en mis especializaciones CSV
  2. Ejecutar diagnóstico completo del área especializada
  3. Resolver autónomamente si está en competencias
  4. Escalar a GPT-4 Turbo solo si requiere testing específico
```

### GPT-4 Turbo (Especialista en Testing según modelos_list.csv)
```yaml
Especialización Principal:
  - Testing Funcional ($40-70)
  - E2E Testing con Playwright
  - Performance Testing
  - Integration Testing

Capacidades de Fallback:
  - Test suite debugging
  - API integration testing issues
  - Build pipeline problems relacionados con testing
  - Testing framework configuration

Primera Acción:
  1. Verificar si el error está relacionado con testing
  2. Ejecutar test suite completo para diagnóstico
  3. Resolver issues de testing autónomamente
  4. Escalar a Claude 3.5 Sonnet si requiere refactoring arquitectural
```

### Gemini Pro 1.5 (Fallback Nivel 3)
```yaml
Capacidades de Fallback:
  - Code analysis cuando principales no disponibles
  - Component debugging
  - API integration fixes
  - Build configuration issues

Primera Acción:
  1. Verificar que Claude 3.5 Sonnet y GPT-4 Turbo no estén disponibles
  2. Ejecutar análisis de código en área problemática
  3. Resolver problemas técnicos dentro de mis capacidades
  4. Documentar limitaciones y recomendar escalación si necesario
```

### Otros Modelos (No en modelos_list.csv)
```yaml
Acción de Emergencia:
  1. Verificar que modelos principales no estén disponibles
  2. Ejecutar diagnóstico básico
  3. SOLO realizar fixes sintaxis básicos
  4. SOLICITAR escalación inmediata para cualquier error crítico
  5. NO intentar tareas complejas fuera de capacidades
```

---

## 🎯 Objetivo del Protocolo

### Garantizar que:
- ✅ Ningún agente trabaje sobre sistema roto
- ✅ Fallbacks se resuelvan con prioridad
- ✅ Continuidad del workflow se mantenga
- ✅ Errores se documenten apropiadamente
- ✅ Escalaciones ocurran automáticamente

### Evitar:
- ❌ Trabajo sobre sistemas inestables
- ❌ Pérdida de contexto entre sesiones
- ❌ Errores no documentados
- ❌ Agentes trabajando sin visibilidad completa

---

**RECORDATORIO:** Este protocolo es OBLIGATORIO y debe ejecutarse ANTES de cualquier otra acción en este directorio.