const express = require("express");
const { createClient } = require("redis");

const app = express();
const port = 3000;
const redisUrl = process.env.REDIS_URL || "redis://redis:6379";
const redis = createClient({ url: redisUrl });

redis.on("error", (error) => console.error("Redis error:", error.message));

app.get("/", async (_request, response) => {
  const count = await redis.incr("page_views");
  response.type("html").send(`<!doctype html><html><body><h1>Contador Docker + Redis</h1><p>Visitas: ${count}</p></body></html>`);
});

async function start() {
  await redis.connect();
  app.listen(port, () => console.log(`Contador escuchando en el puerto ${port}`));
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
