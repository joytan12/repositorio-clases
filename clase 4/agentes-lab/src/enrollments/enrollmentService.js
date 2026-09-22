import { findCourseById } from "../catalog/catalog.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Inscribe a una persona en un curso existente.
 * La dependencia se puede reemplazar en tests sin usar mocks globales.
 */
export function enrollStudent(
  { courseId, email },
  { findCourse = findCourseById } = {}
) {
  const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";

  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { ok: false, reason: "invalid_email" };
  }

  const course = findCourse(courseId);
  if (!course) {
    return { ok: false, reason: "course_not_found" };
  }

  return {
    ok: true,
    enrollment: {
      courseId: course.id,
      courseTitle: course.title,
      email: normalizedEmail
    }
  };
}
