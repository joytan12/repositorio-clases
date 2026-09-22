import { access, cp } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const source = fileURLToPath(
  new URL("../scenarios/no-spec-starter/", import.meta.url)
);
const target = resolve(projectRoot, process.argv[2] ?? "../run-sin-spec");

try {
  await access(target);
  throw new Error(`El destino ya existe; no se sobrescribió nada: ${target}`);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

await cp(source, target, { recursive: true, errorOnExist: true });

function runGit(args) {
  const result = spawnSync("git", args, { cwd: target, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || `Falló git ${args.join(" ")}`);
  }
}

runGit(["init", "-b", "main"]);
runGit(["config", "user.name", "Clase 4 Demo"]);
runGit(["config", "user.email", "clase4@example.invalid"]);
runGit(["add", "."]);
runGit(["commit", "-m", "chore: crear escenario vacio sin spec"]);

console.log(`Escenario sin spec creado en: ${target}`);
console.log(
  "Abre allí una sesión nueva y usa el prompt 1C de PROMPTS-DEMO.md."
);
