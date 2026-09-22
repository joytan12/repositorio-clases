# Guía docente — clase 4

## Resultado de aprendizaje

Al finalizar, el grupo debería poder explicar por qué una spec reduce
ambigüedad, cuándo conviene delegar, qué garantiza un hook frente a una
instrucción, cómo una rama limita el impacto y qué evidencia permite auditar una
sesión.

## Preparación (5 minutos)

Desde la raíz de este laboratorio:

```powershell
node --version
git status --short --branch
npm test
npm run demo:hook
```

Resultado esperado: Node 22+, árbol limpio, 11 pruebas base aprobadas, un
comando de hook permitido y uno bloqueado. `npm run test:spec` y
`npm run test:csv` fallan a propósito en `main`.

Para una comparación justa, prepara un worktree con spec y un repositorio mínimo
sin spec. Abre una sesión nueva del agente en cada uno:

```powershell
git worktree add ../run-con-spec -b demo/con-spec main
npm run prepare:no-spec
```

Si ya existen esa ruta o rama, no las sobrescribas: usa juntas
`../run-con-spec-2` y `demo/con-spec-2` (y un sufijo nuevo en rondas posteriores).

No presentes primero la spec y luego la frase sin spec en la misma conversación:
el contexto previo contaminaría la comparación. Tampoco uses un segundo
worktree completo para la ronda sin spec, porque contendría
`specs/validacion-registro.md`. `prepare:no-spec` crea un repo separado con solo
Node, Git y carpetas vacías. Si `../run-sin-spec` ya existe, usa
`node scripts/prepare-no-spec.mjs ../run-sin-spec-2`.

## Agenda sugerida (80 minutos)

| Minutos | Actividad | Evidencia visible |
|---:|---|---|
| 0–8 | Completar la plantilla de spec | Cuatro secciones acordadas |
| 8–18 | Implementar con spec | Diff pequeño + tests dirigidos |
| 18–25 | Verificar cada criterio | Tabla de cumplimiento con evidencia |
| 25–33 | Petición sin spec en sesión nueva | Preguntas/supuestos/alcance divergente |
| 33–44 | Investigar tres carpetas | Tres resúmenes, trabajo paralelo |
| 44–51 | Hook `PreToolUse` | Bloqueo previo, incluso para un `echo` |
| 51–61 | Rama o worktree | `main` inmóvil y commit aislado |
| 61–74 | CSV con tres subagentes | Código, tests y guía integrados |
| 74–80 | Auditoría | Hechos vs. inferencias vs. desconocido |

Para una versión corta conserva spec, verificación, investigación paralela y
orquestación; deja hook y worktree como demostraciones opcionales.

## Guion y resultados esperados

### 1. Spec-driven

Usa los prompts 1A y 1B de `PROMPTS-DEMO.md`. Guarda lo acordado como
`specs/spec-en-vivo.md`: ese es el archivo que debe leer el agente. Si usas el
ejemplo preparado, la implementación correcta solo toca el validador (y, si es
necesario, sus pruebas), devuelve todos los errores en orden y nunca filtra la
contraseña.

Compara después con el prompt 1C en el repo aislado. “Hazme una función que
valide el registro de una persona” mantiene el objetivo pero elimina el
contrato. `PROMPTS-DEMO.md` también incluye “Hazme un login” como contraste más
dramático; explica que ese caso ya amplía el problema y no es una comparación
controlada. La diferencia de preguntas, supuestos y alcance es el punto.

La solución del docente para el ejemplo preparado está en
`solution/spec-driven`:

```powershell
git diff main..solution/spec-driven
```

### 2. Subagentes

Usa el prompt 2. Los subagentes deberían descubrir este flujo sin editar nada:

```text
catalog → enrollments → notifications
```

`enrollments` depende del catálogo; `notifications` recibe el resultado válido,
pero no produce efectos externos.

### 3. Hook

En Claude Code, confirma `/hooks` y usa el prompt 3. El hook devuelve código 2
antes de la herramienta. El comando es deliberadamente inocuo: solo intenta
imprimir texto. Consulta `docs/HOOK.md` para diagnóstico.

### 4. Branch/worktree

Usa 4A o 4B. Antes y después registra:

```powershell
git rev-parse main
git branch
git log --oneline --graph --decorate --all -10
```

El cambio y su commit deben existir en la rama nueva; el SHA de `main` no debe
cambiar.

### 5. Orquestación

Ejecuta 5A y 5B desde contextos nuevos. Anota resultados en `METRICAS.md`.
Evalúa cumplimiento e integración, no solo velocidad. La solución del docente
está en `solution/orchestration`.

### 6. Skill y auditoría

Invoca el prompt 6 para hacer visible la carga de instrucciones especializadas.
Termina con el prompt 7 y pide al grupo distinguir lo que prueba Git de lo que
solo puede revelar la transcripción.

## Recuperación entre demos

Prefiere crear una rama o worktree nuevo en vez de borrar resultados. Para
volver a la plantilla dentro de un worktree que no tenga cambios valiosos:

```powershell
git restore --source=main -- src/registration/validateRegistration.js test/registration.test.js
git restore --source=main -- src/report/readStudentsCsv.js test/report.test.js docs/reporte-csv.md
```

Estos comandos descartan cambios en esos archivos; ejecútalos solo después de
confirmar que la demostración ya quedó registrada en un commit o no se necesita.

## Preguntas de cierre

1. ¿Qué decisión quedó eliminada por la spec?
2. ¿Qué parte del trabajo paralela era realmente independiente?
3. ¿Qué puede imponer un hook que un prompt no garantiza?
4. ¿Qué demuestra el grafo de Git y qué no demuestra?
5. ¿Qué evidencia faltaría para repetir o auditar la sesión?
