import test from "node:test";
import assert from "node:assert/strict";
import { findCourseById, listCourses } from "../src/catalog/catalog.js";

test("el catálogo filtra por nivel", () => {
  const courses = listCourses({ level: "intermedio" });

  assert.deepEqual(courses.map(({ id }) => id), ["api-201"]);
});

test("el catálogo no expone su estado interno", () => {
  const [course] = listCourses();
  course.title = "Título modificado";

  assert.equal(findCourseById(course.id).title, "Git desde cero");
});

test("buscar un curso inexistente devuelve null", () => {
  assert.equal(findCourseById("missing"), null);
});
