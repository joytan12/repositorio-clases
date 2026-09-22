# Spec: reporte de estudiantes desde CSV

## Objetivo

Implementar `buildStudentReport(csvText)` para convertir un CSV pequeño en un
reporte de aprobación, acompañado por pruebas y documentación de uso.

Esta tarea tiene tres entregables independientes, ideales para tres subagentes:

1. implementación en `src/report/readStudentsCsv.js`;
2. pruebas en `test/report.test.js`;
3. guía de uso en `docs/reporte-csv.md`.

## Requisitos

1. Usar solo APIs nativas de Node.js; no instalar dependencias.
2. Recibir el contenido CSV como texto UTF-8. Ignorar líneas totalmente vacías.
3. La primera línea no vacía debe ser exactamente `name,email,score`, permitiendo
   espacios exteriores alrededor de cada nombre de columna.
4. Cada fila debe tener exactamente tres columnas separadas por coma. Este
   ejercicio no necesita soportar comas escapadas ni campos entre comillas.
5. Normalizar `name` con `trim()` y `email` con `trim().toLowerCase()`.
6. `name` no puede quedar vacío; `email` debe cumplir
   `^[^\s@]+@[^\s@]+\.[^\s@]+$`; `score` debe ser una representación decimal
   entera entre 0 y 100, inclusive.
7. Una fila es `passed` cuando `score >= 60`.
8. Devolver exactamente:

   ```js
   {
     students: [{ name, email, score, passed }],
     summary: { total, passed, failed, average }
   }
   ```

   `average` se redondea a un decimal y vale `0` cuando no hay filas.
9. Ante encabezado o fila inválidos, lanzar `CsvValidationError`. Su propiedad
   `lineNumber` usa numeración humana desde 1 e incluye las líneas vacías
   originales.

## Criterios de aceptación

- **CA-01 — fixture principal:** `data/students.csv` genera 4 estudiantes, 3
  aprobados, 1 reprobado y promedio `72.5`.
- **CA-02 — normalización:** elimina espacios exteriores y pasa correos a
  minúsculas.
- **CA-03 — bordes:** los puntajes `0`, `59`, `60` y `100` son válidos; `60`
  cuenta como aprobado.
- **CA-04 — entrada vacía:** solo encabezado o líneas vacías produce listas y
  contadores vacíos, con promedio `0`.
- **CA-05 — errores localizables:** encabezado incorrecto, cantidad de columnas,
  nombre vacío, correo inválido y puntaje fuera de rango lanzan
  `CsvValidationError` con la línea correcta.
- **CA-06 — entregables:** existen implementación, tests y guía con un ejemplo
  ejecutable.
- **CA-07 — verificación automática:** `npm run test:csv` finaliza con código 0.

## Fuera de alcance

- Leer rutas de archivo dentro de `buildStudentReport`.
- Soportar el estándar CSV completo, comillas, comas escapadas o saltos dentro
  de una celda.
- Crear una CLI, API, UI o base de datos.
- Instalar paquetes o modificar módulos ajenos al reporte.
