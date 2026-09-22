import test from "node:test";
import assert from "node:assert/strict";
import { enrollStudent } from "../src/enrollments/enrollmentService.js";

test("inscribe y normaliza el correo", () => {
  const result = enrollStudent({ courseId: "api-201", email: " ANA@EXAMPLE.COM " });

  assert.deepEqual(result, {
    ok: true,
    enrollment: {
      courseId: "api-201",
      courseTitle: "APIs con Node.js",
      email: "ana@example.com"
    }
  });
});

test("rechaza un correo inválido antes de consultar el catálogo", () => {
  let catalogWasCalled = false;
  const result = enrollStudent(
    { courseId: "api-201", email: "sin-arroba" },
    { findCourse: () => { catalogWasCalled = true; } }
  );

  assert.deepEqual(result, { ok: false, reason: "invalid_email" });
  assert.equal(catalogWasCalled, false);
});

test("informa cuando el curso no existe", () => {
  const result = enrollStudent({ courseId: "missing", email: "ana@example.com" });

  assert.deepEqual(result, { ok: false, reason: "course_not_found" });
});
