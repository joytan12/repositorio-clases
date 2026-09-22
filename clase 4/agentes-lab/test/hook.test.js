import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const hookPath = fileURLToPath(
  new URL("../.claude/hooks/block-dangerous-sql.mjs", import.meta.url)
);

function runHook(command) {
  return spawnSync(process.execPath, [hookPath], {
    encoding: "utf8",
    input: JSON.stringify({
      hook_event_name: "PreToolUse",
      tool_name: "Bash",
      tool_input: { command }
    })
  });
}

test("el hook permite comandos que no contienen DROP TABLE", () => {
  const result = runHook('echo "SELECT * FROM alumnos;"');

  assert.equal(result.status, 0);
  assert.equal(result.stderr, "");
});

test("el hook bloquea DROP TABLE sin importar mayúsculas o espacios", () => {
  const result = runHook('echo "drop   table alumnos;"');

  assert.equal(result.status, 2);
  assert.match(result.stderr, /BLOQUEADO POR HOOK/);
});

test("el hook falla de forma cerrada si recibe JSON ilegible", () => {
  const result = spawnSync(process.execPath, [hookPath], {
    encoding: "utf8",
    input: "esto no es JSON"
  });

  assert.equal(result.status, 2);
  assert.match(result.stderr, /JSON válido/);
});
