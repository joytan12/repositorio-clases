const COURSES = Object.freeze([
  Object.freeze({ id: "git-101", title: "Git desde cero", level: "inicial", capacity: 20 }),
  Object.freeze({ id: "api-201", title: "APIs con Node.js", level: "intermedio", capacity: 15 }),
  Object.freeze({ id: "agents-301", title: "Agentes de desarrollo", level: "avanzado", capacity: 12 })
]);

/** Devuelve copias para que quien consume el catálogo no pueda mutar el origen. */
export function listCourses({ level } = {}) {
  return COURSES
    .filter((course) => level === undefined || course.level === level)
    .map((course) => ({ ...course }));
}

export function findCourseById(courseId) {
  const course = COURSES.find(({ id }) => id === courseId);
  return course ? { ...course } : null;
}
