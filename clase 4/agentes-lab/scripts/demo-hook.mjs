import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const hookPath = fileURLToPath(
  new URL("../.claude/hooks/block-dangerous-sql.mjs", import.meta.url)
);

const examples = [
  'echo "SELECT * FROM alumnos;"',
  'echo "DROP TABLE alumnos;"'
];

for (const command of examples) {
  const result = spawnSync(process.execPath, [hookPath], {
    encoding: "utf8",
    input: JSON.stringify({ tool_input: { command } })
  });

  console.log(`Comando: ${command}`);
  console.log(`Código de salida del hook: ${result.status}`);
  console.log(result.stderr.trim() || "PERMITIDO");
  console.log("");
}
