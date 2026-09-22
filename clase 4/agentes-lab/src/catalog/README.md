# Catálogo

Responsabilidad: exponer los cursos disponibles y buscar uno por su identificador.

## Contrato público

- `listCourses({ level? })`: entrega copias de los cursos y permite filtrar por nivel.
- `findCourseById(courseId)`: devuelve una copia del curso o `null`.

El arreglo fuente es privado e inmutable. Esta carpeta no conoce inscripciones ni
notificaciones.
