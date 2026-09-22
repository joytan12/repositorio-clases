# Demo 1: hello-world

## Ejecutar

```bash
docker run hello-world
```

## Que observar

1. Docker busca la imagen localmente.
2. Si no existe, la descarga desde Docker Hub.
3. Crea un contenedor a partir de esa imagen.
4. Ejecuta el proceso y muestra el mensaje.
5. El proceso termina, por eso el contenedor deja de estar activo.

## Comandos de apoyo

```bash
docker image ls hello-world
docker ps -a --filter ancestor=hello-world
```

Pregunta para la clase: que parte es reutilizable y que parte es una ejecucion concreta? La imagen es la plantilla; el contenedor es la instancia.
