import test from "node:test";
import assert from "node:assert/strict";
import { buildEnrollmentConfirmation } from "../src/notifications/notificationService.js";

test("construye una confirmación sin producir efectos externos", () => {
  const message = buildEnrollmentConfirmation({
    email: "ana@example.com",
    courseTitle: "APIs con Node.js"
  });

  assert.deepEqual(message, {
    to: "ana@example.com",
    subject: "Inscripción confirmada: APIs con Node.js",
    body: "Tu cupo en APIs con Node.js quedó confirmado."
  });
});

test("rechaza inscripciones incompletas", () => {
  assert.throws(
    () => buildEnrollmentConfirmation({ email: "ana@example.com" }),
    /inscripción válida/
  );
});
