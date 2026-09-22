# Clase 4 — Laboratorio de desarrollo con agentes

Proyecto pequeño y autocontenido para demostrar, en vivo:

- desarrollo guiado por una spec y verificación criterio por criterio;
- investigación paralela con subagentes sin llenar la conversación principal;
- hooks determinísticos antes de usar herramientas;
- cambios aislados con ramas y worktrees;
- orquestación de código, tests y documentación;
- seguimiento mediante Git, pruebas y transcripción;
- carga explícita de una skill durante una tarea.

## Requisitos

- Node.js 22 o superior.
- Git.
- Un agente con capacidad de subagentes para los ejercicios generales.
- Claude Code para la demo específica de `.claude/settings.json` y
  `.claude/skills/`.

No se necesita `npm install`: el proyecto no tiene dependencias externas.

## Inicio rápido

```powershell
cd "clase 4/agentes-lab"
node --version
npm test
npm run demo:hook
```

`npm test` valida la aplicación de ejemplo y el hook. Debe quedar verde desde
el inicio. Los dos ejercicios incompletos son deliberadamente rojos:

```powershell
npm run test:spec
npm run test:csv
```

Los prompts para copiar están en `PROMPTS-DEMO.md`; el orden de la sesión y los
resultados esperados están en `GUIA-DOCENTE.md`.

## Mapa del laboratorio

| Ruta | Uso en clase |
|---|---|
| `specs/PLANTILLA.md` | Completar una spec con el grupo |
| `specs/validacion-registro.md` | Ejercicio spec-driven ya preparado |
| `src/registration/` | Implementación inicial incompleta |
| `scenarios/no-spec-starter/` | Proyecto mínimo sin pistas para comparar |
| `src/catalog/`, `src/enrollments/`, `src/notifications/` | Investigación paralela |
| `.claude/hooks/` | Bloqueo de `DROP TABLE` antes de ejecutar |
| `.claude/skills/verificar-spec/` | Skill manual de auditoría |
| `specs/cambio-branch.md` | Cambio pequeño para rama/worktree |
| `specs/reporte-csv.md` | Tarea de tres entregables paralelizables |
| `METRICAS.md` | Comparación paralela vs. agente único |
| `AUDITORIA-SESION.md` | Reconstrucción de una sesión |

## Soluciones de referencia

El repositorio incluye soluciones fuera de `main`, para que no aparezcan en el
árbol durante la demo:

```powershell
git branch --list "solution/*"
git diff main..solution/spec-driven
git diff main..solution/orchestration
```

No cambies a esas ramas antes de la actividad si quieres evitar dar pistas al
agente. La rama inicial se mantiene deliberadamente incompleta.
