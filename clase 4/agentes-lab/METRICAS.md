# Comparación: orquestación paralela vs. agente único

Ejecuta ambas variantes desde `main`, en worktrees y sesiones nuevas. Usa la
misma spec y no compartas la conversación entre intentos.

| Métrica | Subagentes en paralelo | Agente único |
|---|---:|---:|
| Hora de inicio |  |  |
| Hora de término |  |  |
| Minutos totales |  |  |
| Tests aprobados / total |  |  |
| Archivos cambiados |  |  |
| Rondas de corrección |  |  |
| Conflictos de integración |  |  |
| Criterios cumplidos / 7 |  |  |

## Observaciones cualitativas

- ¿Cada agente respetó la propiedad de archivos?
- ¿Las pruebas se derivaron de la spec o de la implementación?
- ¿La documentación coincidió con el comportamiento real?
- ¿Qué ruido llegó a la conversación principal?
- ¿La paralelización ayudó o agregó coordinación? En una tarea pequeña puede
  tardar más; el valor también está en el aislamiento y la trazabilidad.
