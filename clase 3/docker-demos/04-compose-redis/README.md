# Demo 4: Compose con Node.js y Redis

Esta demo levanta dos servicios: una aplicacion Node.js y un Redis. La aplicacion incrementa un contador guardado en Redis cada vez que se visita `/`.

## Ejecutar

```bash
docker compose up --build -d
docker compose ps
```

Abre `http://localhost:8081` y actualiza la pagina varias veces. Tambien puedes comprobarlo desde la terminal:

```bash
curl http://localhost:8081
docker compose logs counter
```

## Que observar

- `docker-compose.yml` describe el sistema completo.
- `counter` se construye con el Dockerfile local.
- `redis` usa una imagen existente.
- Dentro de Compose, `redis` es el nombre DNS del servicio.
- `depends_on` espera el healthcheck de Redis antes de iniciar la app.
- Un solo comando crea la red y levanta ambos contenedores.

## Limpiar

```bash
docker compose down -v
```

El flag `-v` elimina los volumenes declarados; en esta demo no hay datos persistentes, pero sirve para dejar el entorno completamente limpio.
