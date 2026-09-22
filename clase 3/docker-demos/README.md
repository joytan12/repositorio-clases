# Docker Demos - Clase 3

Repositorio de apoyo para una clase introductoria de Docker. Las demos estan ordenadas para ejecutarse justo despues de la diapositiva que las presenta.

## Requisitos

- Docker Desktop instalado y abierto.
- Terminal PowerShell, CMD o Bash.
- Acceso a internet la primera vez que se descarguen las imagenes.

## Orden sugerido para la clase

| Momento | Demo | Tiempo | Idea que demuestra |
|---|---|---:|---|
| 1 | `01-hello-world` | 2 min | Imagen, contenedor, ejecucion y salida |
| 2 | `02-nginx-stats` | 3 min | Un servicio en segundo plano y consumo observable |
| 3 | `03-dockerfile-node` | 8-10 min | Dockerfile -> imagen -> contenedor |
| 4 | `04-compose-redis` | 5 min opcionales | Varios servicios con una sola orden |

## Guion rapido

### 1. El hola mundo de Docker

Desde la raiz de este repositorio:

```bash
docker run hello-world
```

Pide a la clase que identifique tres hechos: Docker descargo una imagen, creo un contenedor y ejecuto un proceso que termino.

### 2. Peso real de un contenedor

```bash
docker run -d --name demo-nginx nginx:alpine
docker ps
docker stats --no-stream demo-nginx
```

Abre `http://localhost:8080` despues de usar el puerto publicado:

```bash
docker rm -f demo-nginx
docker run -d --name demo-nginx -p 8080:80 nginx:alpine
```

Al terminar:

```bash
docker rm -f demo-nginx
```

Aclara que `docker stats` muestra el consumo del proceso en ese momento y que no es una comparacion cientifica contra una VM.

### 3. Escribir un Dockerfile en vivo

Entra a `03-dockerfile-node` y muestra `index.js`, `Dockerfile` y `.dockerignore`:

```bash
cd 03-dockerfile-node
docker build -t hola-clase .
docker run --rm hola-clase
cd ..
```

La salida esperada es:

```text
Hola clase!
```

Relaciona cada instruccion con el diagrama:

- `FROM`: imagen base.
- `WORKDIR`: carpeta de trabajo dentro de la imagen.
- `COPY`: incorpora archivos.
- `CMD`: proceso que ejecuta el contenedor.

### 4. Demo opcional: contador + Redis

```bash
cd 04-compose-redis
docker compose up --build -d
docker compose ps
```

Abre `http://localhost:8081` y actualiza la pagina varias veces. El contador se guarda en Redis, que vive en otro contenedor.

Verificacion desde la terminal:

```bash
curl http://localhost:8081
docker compose logs counter
```

Para limpiar:

```bash
docker compose down -v
cd ..
```

## Puente hacia la siguiente clase

Prompt sugerido para mostrar a la clase:

> Crea un Dockerfile para esta aplicacion Node.js, usa una imagen Alpine, copia los archivos necesarios, construye la imagen con el nombre `hola-clase` y ejecuta el contenedor. Explica cada instruccion antes de correr comandos.

La idea es mostrar que un agente puede acelerar la escritura, pero la persona debe revisar el Dockerfile, entender el puerto, validar la imagen y observar el proceso que queda ejecutandose.

## Limpieza general

Si quedaran contenedores de las demos:

```bash
docker rm -f demo-nginx 2>$null
docker compose -f 04-compose-redis/docker-compose.yml down -v
```

En Bash, si `2>$null` no funciona, usa `2>/dev/null`.

## Estructura

```text
docker-demos/
|-- README.md
|-- 01-hello-world/
|   `-- README.md
|-- 02-nginx-stats/
|   `-- README.md
|-- 03-dockerfile-node/
|   |-- .dockerignore
|   |-- Dockerfile
|   |-- README.md
|   `-- index.js
`-- 04-compose-redis/
    |-- Dockerfile
    |-- README.md
    |-- docker-compose.yml
    |-- package.json
    `-- server.js
```
