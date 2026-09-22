import test from "node:test";
import assert from "node:assert/strict";
import { validateRegistration } from "../src/registration/validateRegistration.js";

test("CA-01: acepta, normaliza y devuelve solo los datos permitidos", () => {
  const result = validateRegistration({
    email: " ANA@Example.COM ",
    password: "Clave123",
    age: 18
  });

  assert.deepEqual(result, {
    ok: true,
    value: { email: "ana@example.com", age: 18 }
  });
  assert.equal(JSON.stringify(result).includes("Clave123"), false);
});

test("CA-02: rechaza un correo inválido", () => {
  const result = validateRegistration({
    email: "ana.example.com",
    password: "Clave123",
    age: 22
  });

  assert.deepEqual(result, {
    ok: false,
    errors: [{ field: "email", code: "email_invalid" }]
  });
});

for (const password of ["Corta1", "MAYUSCULA1", "minuscula1", "SinNumero"]){
  test(`CA-03: rechaza la contraseña débil ${JSON.stringify(password)}`, () => {
    const result = validateRegistration({
      email: "ana@example.com",
      password,
      age: 22
    });

    assert.deepEqual(result, {
      ok: false,
      errors: [{ field: "password", code: "password_weak" }]
    });
  });
}

for (const age of [17, 18.5, "18", null]) {
  test(`CA-04: rechaza la edad ${JSON.stringify(age)}`, () => {
    const result = validateRegistration({
      email: "ana@example.com",
      password: "Clave123",
      age
    });

    assert.deepEqual(result, {
      ok: false,
      errors: [{ field: "age", code: "age_restricted" }]
    });
  });
}

for (const input of [null, {}]) {
  test(`CA-05: acumula errores sin lanzar para ${JSON.stringify(input)}`, () => {
    assert.doesNotThrow(() => validateRegistration(input));
    assert.deepEqual(validateRegistration(input), {
      ok: false,
      errors: [
        { field: "email", code: "email_invalid" },
        { field: "password", code: "password_weak" },
        { field: "age", code: "age_restricted" }
      ]
    });
  });
}

test("CA-06: una respuesta inválida tampoco filtra la contraseña", () => {
  const result = validateRegistration({
    email: "incorrecto",
    password: "secreto-super-sensible",
    age: 12
  });

  assert.equal(JSON.stringify(result).includes("secreto-super-sensible"), false);
});
