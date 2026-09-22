# Demo: hook `PreToolUse`

El hook compartido de `.claude/settings.json` inspecciona los comandos de las
herramientas `Bash` y `PowerShell`. Si detecta `DROP TABLE`, imprime el motivo en
`stderr` y termina con código `2`; Claude Code bloquea la herramienta antes de
ejecutarla.

## Comprobación local, sin un agente

```powershell
npm run demo:hook
```

La salida muestra un `SELECT` permitido (código `0`) y un `DROP TABLE` bloqueado
(código `2`). Ninguno de los dos ejemplos toca una base de datos: ambos son solo
texto enviado directamente al hook.

## Comprobación dentro de Claude Code

1. Abre Claude Code desde la raíz del laboratorio y acepta la confianza del
   workspace.
2. Usa `/hooks` para confirmar que el `PreToolUse` está cargado.
3. Pega el prompt correspondiente de `PROMPTS-DEMO.md`.

Este regex es deliberadamente pequeño para enseñar el mecanismo. No sustituye
permisos de base de datos, consultas parametrizadas ni controles de producción.

Documentación oficial consultada:

- https://code.claude.com/docs/en/hooks
- https://code.claude.com/docs/en/hooks-guide
- https://code.claude.com/docs/en/settings
