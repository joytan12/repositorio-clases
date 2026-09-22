# Demo 2: Nginx y consumo

## Ejecutar

```bash
docker run -d --name demo-nginx -p 8080:80 nginx:alpine
docker ps
docker stats --no-stream demo-nginx
```

Abre `http://localhost:8080` para comprobar que el proceso sigue atendiendo peticiones.

## Que observar

- `-d` deja el contenedor ejecutandose en segundo plano.
- `--name` asigna un nombre facil de recordar.
- `-p 8080:80` conecta el puerto del equipo con el puerto del contenedor.
- `docker stats` permite observar CPU y memoria del contenedor.

## Limpiar

```bash
docker rm -f demo-nginx
```

La cifra de memoria cambia segun el sistema y el momento. Usala como observacion, no como benchmark.
