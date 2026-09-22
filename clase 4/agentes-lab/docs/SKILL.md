# Demo: skill de verificación

La skill vive en `.claude/skills/verificar-spec/SKILL.md`. Está marcada como
manual para que el momento de carga sea visible y repetible durante la clase.

Después de implementar el ejercicio 1, invócala así:

```text
/verificar-spec specs/spec-en-vivo.md contra la implementación actual.
```

Si usaste el ejemplo preparado, cambia la ruta a
`specs/validacion-registro.md`.

Como está marcada `disable-model-invocation: true`, queda fuera del contexto del
modelo hasta que una persona la invoca desde el menú `/`. En ese momento se
cargan las instrucciones completas: revisar cada criterio, ejecutar tests y
entregar una tabla con evidencia, sin editar el código.

Documentación oficial: https://code.claude.com/docs/en/skills
