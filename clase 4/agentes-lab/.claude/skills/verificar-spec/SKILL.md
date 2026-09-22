---
name: verificar-spec
description: Compara una implementación con cada criterio de aceptación de una spec del laboratorio y entrega evidencia verificable. Úsala cuando se solicite verificar, auditar o revisar el cumplimiento de una spec.
disable-model-invocation: true
---

# Verificar una implementación contra su spec

Realiza una auditoría; no edites código durante esta skill.

1. Lee completa la spec que indique el usuario.
2. Extrae todos los criterios de aceptación, conservando sus identificadores.
3. Inspecciona la implementación y las pruebas relacionadas.
4. Ejecuta el comando de prueba que defina la spec.
5. Devuelve una tabla con las columnas `Criterio`, `Estado` y `Evidencia`.
6. Usa únicamente estos estados: `CUMPLE`, `NO CUMPLE`, `NO VERIFICABLE`.
7. No declares cumplimiento solo porque existe un test: relaciona el requisito,
   el código y el resultado observado.
8. Cierra con un veredicto explícito: si cumple todos o cuáles faltan.

Si algo no cumple, propone el cambio mínimo, pero espera autorización antes de
editar porque esta skill es de verificación.
