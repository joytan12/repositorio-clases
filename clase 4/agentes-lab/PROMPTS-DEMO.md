# Prompts listos para la clase 4

Cada bloque se puede copiar tal cual. Las notas fuera de los bloques son para
quien facilita la clase, no forman parte del prompt.

## 0. Diagnóstico inicial

```text
Sin modificar archivos, inspecciona este proyecto. Dime en no más de ocho
viñetas qué partes ya funcionan, qué ejercicios están incompletos y qué
comandos de prueba existen. No implementes nada todavía.
```

## 1A. Completar una spec en vivo

Primero crea la spec que realmente recibirá el agente:

```powershell
Copy-Item specs/PLANTILLA.md specs/spec-en-vivo.md
```

Completa `specs/spec-en-vivo.md` con el grupo. Además de las cuatro secciones,
deja explícitos el archivo autorizado, la API y el comando de prueba. Luego pega:

```text
Lee completa specs/spec-en-vivo.md. Implementa únicamente lo que esa spec pide.
No modifiques la spec ni archivos que ella no autorice, no agregues dependencias
y no amplíes el alcance. Ejecuta las verificaciones definidas en la spec. Al
terminar, informa archivos cambiados, comandos ejecutados y resultados, sin
implementar nada adicional.
```

Si necesitas avanzar rápido, usa el ejemplo ya terminado en
`specs/validacion-registro.md` y este prompt listo:

```text
Lee completa specs/validacion-registro.md. Implementa únicamente esa spec en
src/registration/validateRegistration.js. Puedes agregar o ajustar pruebas en
test/registration.test.js solo si hace falta para representar la spec. No
modifiques otros archivos, no agregues dependencias y no amplíes el alcance.
Ejecuta npm run test:spec y después npm test. Al terminar, informa archivos
cambiados y resultados, sin implementar nada adicional.
```

## 1B. Verificación visible contra cada criterio

Esta es la fase **Verificar** del flujo. Primero hazla sin permitir correcciones.
Para la spec escrita por el grupo:

```text
Compara tu implementación contra cada criterio de aceptación de
specs/spec-en-vivo.md y dime si los cumple todos. No corrijas nada en esta
revisión. Ejecuta las verificaciones de la spec y entrega una tabla con
criterio, estado CUMPLE/NO CUMPLE/NO VERIFICABLE y evidencia concreta en código,
pruebas o salida observada. Cierra con un veredicto explícito y enumera cualquier
incumplimiento.
```

Para el ejemplo preparado:

```text
Compara tu implementación contra cada criterio de aceptación CA-01 a CA-07 de
specs/validacion-registro.md y dime si los cumple todos. No corrijas nada en
esta revisión. Ejecuta las pruebas y entrega una tabla con criterio, estado
CUMPLE/NO CUMPLE/NO VERIFICABLE y evidencia concreta en código o pruebas.
Cierra con un veredicto explícito y enumera cualquier incumplimiento.
```

## 1C. La misma petición sin spec

Haz esta prueba en el **escenario aislado y una sesión nueva** para no contaminar
al agente con la spec, el README ni las instrucciones del laboratorio:

```powershell
npm run prepare:no-spec
cd ../run-sin-spec
```

El script aborta si el destino ya existe y nunca sobrescribe resultados. Para
repetir, usa un nombre nuevo: `node scripts/prepare-no-spec.mjs ../run-sin-spec-2`.
Abre el agente desde esa nueva carpeta. Si el ejercicio 1A usó la validación de
registro propuesta, pega solamente:

```text
Hazme una función que valide el registro de una persona.
```

Si el grupo escribió otra spec en vivo, reemplaza esa frase por una sola oración
con el mismo objetivo, pero sin requisitos ni criterios.

Si el agente pide aclaraciones, esa necesidad ya es evidencia de ambigüedad. Si
implementa algo, compara alcance, archivos, pruebas y supuestos con la variante
guiada por spec; no intentes forzar ambos resultados al mismo contrato. Un
worktree completo del laboratorio no sirve para esta ronda: también copiaría la
spec y contaminaría la comparación.

Como contraste más teatral —y deliberadamente todavía más ambiguo— puedes abrir
otro escenario vacío y usar la frase sugerida en la diapositiva:

```text
Hazme un login.
```

Aclara al grupo que esta segunda variante ya no controla exactamente el mismo
objetivo: sirve para visualizar la expansión de alcance, no para comparar dos
implementaciones equivalentes.

## 2. Investigación paralela con subagentes

```text
Sin modificar archivos, investiga en paralelo cómo funcionan las carpetas
src/catalog, src/enrollments y src/notifications. Usa un subagente independiente
por carpeta. Tráeme solo tres resúmenes, uno por carpeta, con máximo cinco
viñetas cada uno: responsabilidad, API pública, entradas/salidas, dependencias y
un riesgo o decisión de diseño. Termina con una sola línea que muestre el flujo
entre las tres carpetas. No incluyas el razonamiento interno ni el ruido de cada
subagente.
```

## 3. Hook determinístico `PreToolUse`

Esta demo requiere Claude Code abierto desde la raíz del laboratorio. Revisa
primero `/hooks`. El comando solicitado solo imprimiría texto: no hay base de
datos involucrada, incluso si el hook no estuviera activo.

```text
No cambies ni desactives los hooks. Intenta ejecutar exactamente este comando y
no lo reformules:

echo "DROP TABLE alumnos;"

No uses una base de datos. Si el hook lo bloquea, informa el motivo y detente.
```

Control positivo, que sí debería pasar:

```text
Ejecuta exactamente: echo "SELECT * FROM alumnos;"
```

## 4A. Cambio en una rama nueva

Parte desde `main` limpio.

```text
Haz el cambio descrito en specs/cambio-branch.md en una rama nueva llamada
demo/filtro-titulo, sin mover ni modificar el puntero de main. Antes de editar,
registra el SHA actual de main. Implementa solo ese cambio, ejecuta npm test y
crea un commit con un mensaje descriptivo. Al terminar muestra:

git branch --show-current
git status --short
git log --oneline --graph --decorate --all -10

Confirma además que el SHA de main sigue siendo el registrado al inicio.
```

## 4B. Variante con worktree

Usa esta variante en vez de 4A si quieres que la separación también sea visible
en el sistema de archivos.

```text
Desde main, crea un worktree hermano en ../agentes-lab-filtro con una rama nueva
demo/filtro-worktree. Realiza allí, y no en el worktree actual, el cambio de
specs/cambio-branch.md. Ejecuta npm test y crea un commit. Después muestra
git worktree list y git log --oneline --graph --decorate --all -10. No elimines
el worktree al terminar.
```

## 5A. Tarea dividida y orquestada

Parte desde un worktree nuevo basado en `main`.

```text
Implementa specs/reporte-csv.md orquestando tres subagentes en paralelo. Asigna
propiedad exclusiva de archivos:

- Subagente A: solo src/report/readStudentsCsv.js.
- Subagente B: solo test/report.test.js.
- Subagente C: solo docs/reporte-csv.md.

Los tres deben trabajar directamente desde la spec y no editar archivos ajenos.
Cuando terminen, integra sus resultados, ejecuta npm run test:csv y npm test, y
corrige únicamente problemas reales de integración dentro de esos tres archivos.
Entrega un resumen breve por subagente, resultado de pruebas y lista final de
archivos cambiados. No agregues dependencias ni amplíes el alcance.
```

## 5B. Comparación con un solo agente

Ejecuta esto en otro worktree y otra sesión, ambos nuevos y basados en `main`.

```text
Implementa todo lo descrito en specs/reporte-csv.md: código, pruebas y guía de
uso. Hazlo tú solo, no delegues, no agregues dependencias y ejecuta
npm run test:csv y npm test antes de terminar. Informa tiempo aproximado,
archivos cambiados, pruebas y rondas de corrección.
```

Registra ambas rondas en `METRICAS.md`. En una tarea pequeña los subagentes
pueden tardar igual o más; compara también aislamiento, ruido y trazabilidad.

## 6. Cargar una skill a mitad de la tarea

Después del ejercicio 1, invoca explícitamente la skill incluida:

```text
/verificar-spec specs/spec-en-vivo.md contra la implementación actual.
```

Su instrucción completa se carga en ese momento y exige una matriz de evidencia
sin permitir que la revisión edite el código.

Si usaste el ejemplo preparado, reemplaza la ruta por
`specs/validacion-registro.md`.

## 7. Auditar una sesión ya ejecutada

```text
No modifiques archivos. Reconstruye qué hizo el agente usando git status,
git log --oneline --graph --decorate --all, git show --stat, los resultados de
pruebas y la transcripción si está disponible. Separa el informe en: hechos
demostrables, inferencias y cosas que no pueden saberse con el registro. Explica
qué se pidió, qué se cambió, qué se verificó y por qué parece haberse tomado
cada decisión. Usa AUDITORIA-SESION.md como formato de salida.
```
