/**
 * Ejercicio 3: implementar con un subagente siguiendo specs/reporte-csv.md.
 */
export function buildStudentReport(_csvText) {
  throw new Error("TODO: implementar desde la spec");
}

export class CsvValidationError extends Error {
  constructor(message, lineNumber) {
    super(message);
    this.name = "CsvValidationError";
    this.lineNumber = lineNumber;
  }
}
