# Solución al Problema de Consulta de Agregación MongoDB

## Problema
La consulta de agregación para obtener documentos pendientes funciona correctamente cuando se ejecuta directamente en la base de datos, pero devuelve 0 resultados cuando se ejecuta a través del controlador de Node.js, a pesar de que hay documentos que cumplen con los criterios.

## Diagnóstico
Después de una investigación detallada, se identificó que el problema estaba en la referencia a la variable `doc` en la consulta de agregación. En el controlador, se estaba usando `$doc.v.status` en lugar de `$$doc.v.status`.

En MongoDB Aggregation Framework:
- `$$doc` se refiere a la variable llamada "doc" que se define con el parámetro `as` en la operación `$filter`
- `$doc` se referiría a un campo llamado "doc" en el documento en sí

## Solución Aplicada
1. Corregir la referencia a la variable en la condición del `$filter`:
   ```javascript
   // Antes (incorrecto)
   $eq: ["$doc.v.status", "pendiente"]
   
   // Después (correcto)
   $eq: ["$$doc.v.status", "pendiente"]
   ```

2. Añadir un `$match` inicial en la pipeline para filtrar solo usuarios que tienen verificaciones, mejorando el rendimiento:
   ```javascript
   {
     $match: {
       verificaciones: { $exists: true, $ne: {} }
     }
   }
   ```

## Archivos Modificados
- `/backend/controllers/adminController.js` - Corrección de la consulta de agregación en la función `getPendingDocuments`

## Verificación
Para verificar que la solución funciona correctamente, se creó un script de prueba:
```bash
cd backend
node test-aggregation-fix.js
```

Este script confirma que la consulta devuelve correctamente los usuarios con documentos pendientes.