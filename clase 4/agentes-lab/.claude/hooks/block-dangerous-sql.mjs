let rawInput = "";

process.stdin.setEncoding("utf8");
for await (const chunk of process.stdin) {
  rawInput += chunk;
}

let hookInput;
try {
  hookInput = JSON.parse(rawInput);
} catch {
  console.error("BLOQUEADO POR HOOK: la entrada del hook no es JSON válido.");
  process.exit(2);
}

const command = String(hookInput?.tool_input?.command ?? "");

if (/\bDROP\s+TABLE\b/i.test(command)) {
  console.error(
    "BLOQUEADO POR HOOK: DROP TABLE no está permitido en esta demo."
  );
  process.exit(2);
}

process.exit(0);
