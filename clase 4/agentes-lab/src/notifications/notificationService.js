/** Construye el mensaje, pero deliberadamente no envía correo ni toca la red. */
export function buildEnrollmentConfirmation(enrollment) {
  if (!enrollment?.email || !enrollment?.courseTitle) {
    throw new TypeError("Se requiere una inscripción válida");
  }

  return {
    to: enrollment.email,
    subject: `Inscripción confirmada: ${enrollment.courseTitle}`,
    body: `Tu cupo en ${enrollment.courseTitle} quedó confirmado.`
  };
}
