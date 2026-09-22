# Spec: validación de registro

## Objetivo

Implementar `validateRegistration(input)` para validar, de forma pura y
determinística, los datos mínimos de una persona que quiere registrarse.

El único archivo de producción que se debe modificar es
`src/registration/validateRegistration.js`. Se pueden ajustar o agregar pruebas
en `test/registration.test.js`, pero no se debe cambiar el contrato descrito aquí.

## Requisitos

1. La entrada esperada es un objeto con `email`, `password` y `age`.
2. `email` debe ser texto, se normaliza con `trim().toLowerCase()` y debe cumplir
   el patrón básico `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
3. `password` debe ser texto, tener al menos 8 caracteres e incluir al menos una
   minúscula, una mayúscula y un dígito. No se recorta ni se devuelve.
4. `age` debe ser un número entero mayor o igual a 18.
5. Para una entrada válida, devolver exactamente:
   `{ ok: true, value: { email: <normalizado>, age: <edad> } }`.
6. Para una entrada inválida, devolver exactamente
   `{ ok: false, errors: [...] }`. Cada error tiene la forma `{ field, code }` y
   usa estos códigos: `email_invalid`, `password_weak`, `age_restricted`.
7. Si fallan varios campos, devolver todos los errores en este orden estable:
   `email`, `password`, `age`.
8. No lanzar excepciones por `null`, arreglos, primitivas, campos ausentes o
   tipos incorrectos; tratarlos como campos inválidos.

## Criterios de aceptación

- **CA-01 — caso válido:** con `{ email: " ANA@Example.COM ", password:
  "Clave123", age: 18 }` devuelve exactamente `{ ok: true, value: { email:
  "ana@example.com", age: 18 } }`.
- **CA-02 — correo inválido:** un correo sin formato válido produce
  `{ field: "email", code: "email_invalid" }`.
- **CA-03 — contraseña débil:** menos de 8 caracteres o la ausencia de
  minúscula, mayúscula o dígito produce `{ field: "password", code:
  "password_weak" }`.
- **CA-04 — edad restringida:** una edad decimal, menor que 18 o de otro tipo
  produce `{ field: "age", code: "age_restricted" }`.
- **CA-05 — acumulación estable:** `null` y `{}` no lanzan; devuelven los tres
  errores en el orden `email`, `password`, `age`.
- **CA-06 — datos sensibles:** ninguna salida válida o inválida contiene la
  contraseña recibida.
- **CA-07 — verificación automática:** `npm run test:spec` finaliza con código 0.

## Fuera de alcance

- Crear un endpoint HTTP, formulario o interfaz visual.
- Autenticar, iniciar sesión, generar tokens o guardar usuarios.
- Consultar una base de datos o comprobar si el correo ya existe.
- Agregar dependencias, cifrar la contraseña o modificar otros módulos.
