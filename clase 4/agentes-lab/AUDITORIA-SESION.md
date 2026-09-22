# Hoja de auditoría de una sesión

## Evidencia a recolectar

```powershell
git status --short --branch
git log --oneline --graph --decorate --all -15
git show --stat --oneline HEAD
git diff
git diff --cached
git diff main...HEAD
npm test
```

`git diff` muestra cambios sin commit, `git diff --cached` los preparados y
`main...HEAD` los commits exclusivos de la rama. Agrega, si la herramienta lo
permite, la transcripción o exportación de la sesión. Git muestra el estado
actual y lo registrado; que un test pase ahora no demuestra por sí solo que el
agente lo haya ejecutado. La transcripción, CI o un log de comandos ayudan a
probar la ejecución y a explicar decisiones e intentos descartados.

## Reconstrucción

### Hechos demostrables

- Petición observable:
- Archivos creados/modificados:
- Commits y rama:
- Pruebas que pasan en el estado actual:
- Evidencia de que el agente las ejecutó (transcripción, CI o log):

### Inferencias razonables

- Orden probable de trabajo:
- Motivo probable de las decisiones:

### No verificable con el registro disponible

- Acciones o razonamientos que no dejaron evidencia:
- Pruebas que el agente afirmó ejecutar pero no quedaron registradas:

## Veredicto

- ¿Se puede reconstruir qué hizo?
- ¿Se puede reconstruir por qué lo hizo?
- ¿Qué evidencia faltó para una auditoría confiable?
