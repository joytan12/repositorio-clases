# Inscripciones

Responsabilidad: validar una solicitud pequeña de inscripción y vincularla con
un curso existente.

## Dependencias

Importa `findCourseById` desde `catalog`. También acepta esa dependencia como
parámetro opcional para que las pruebas sean determinísticas.

## Resultado

Nunca lanza por datos de negocio. Devuelve `{ ok: false, reason }` o
`{ ok: true, enrollment }`.
