# Cambio aislado: filtro de catálogo por texto

## Objetivo

Extender `listCourses` para que acepte un filtro opcional `query` sin romper el
filtro existente por `level`.

## Requisitos

1. La firma pública pasa a ser `listCourses({ level, query } = {})`.
2. Si `query` es texto no vacío después de `trim()`, devolver solo cursos cuyo
   `title` lo contenga, ignorando mayúsculas y minúsculas.
3. Si `query` falta, no es texto o queda vacío, no aplicar filtro de texto.
4. Los filtros `level` y `query` se combinan con AND.
5. Mantener copias defensivas y agregar pruebas en `test/catalog.test.js`.
6. No modificar otros módulos ni instalar dependencias.

## Criterios de aceptación

- `listCourses({ query: "node" })` devuelve solo `api-201`.
- `listCourses({ query: "  AGENTES " })` devuelve solo `agents-301`.
- `listCourses({ level: "inicial", query: "node" })` devuelve `[]`.
- Las pruebas nuevas y `npm test` pasan.
