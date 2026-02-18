# Docker Networking Explained (Simple Version)

Think of Docker like a school building 🏫\
- Container = Classroom\
- Network = Hallway\
- Port = Door number

------------------------------------------------------------------------

## 1️⃣ Bridge Network (Default)

### CLI

``` bash
docker run -d -p 8080:80 nginx
```

-   Automatically uses the default bridge network\
-   `-p 8080:80` means:
    -   Outside door: 8080
    -   Inside container door: 80

------------------------------------------------------------------------

### docker-compose.yml

``` yaml
services:
  web:
    image: nginx
    ports:
      - "8080:80"
```

-   If no network is defined, Compose automatically creates a default
    network.
-   Containers in the same compose file can talk using service names.

------------------------------------------------------------------------

## 2️⃣ Custom Network (Private Hallway)

### CLI

Create network:

``` bash
docker network create mynet
```

Run containers in that network:

``` bash
docker run -d --network mynet --name db postgres
docker run -d --network mynet --name app nginx
```

Now `app` can talk to `db` using:

    db:5432

------------------------------------------------------------------------

### docker-compose.yml

``` yaml
services:
  db:
    image: postgres
    networks:
      - mynet

  app:
    image: nginx
    networks:
      - mynet

networks:
  mynet:
```

Compose creates `mynet` automatically.

Containers communicate using:

    service-name:port

------------------------------------------------------------------------

## 3️⃣ Host Network (No Isolation)

### CLI

``` bash
docker run --network host nginx
```

-   No port mapping needed.
-   Container directly uses system ports.
-   Mostly works on Linux.

------------------------------------------------------------------------

### docker-compose.yml

``` yaml
services:
  web:
    image: nginx
    network_mode: host
```

------------------------------------------------------------------------

## 4️⃣ No Network (Fully Isolated)

### CLI

``` bash
docker run --network none nginx
```

-   No internet
-   Cannot talk to other containers

------------------------------------------------------------------------

### docker-compose.yml

``` yaml
services:
  web:
    image: nginx
    network_mode: none
```

------------------------------------------------------------------------

## 5️⃣ How Containers Find Each Other

If using:

-   Custom network (CLI)
-   Or docker-compose (default behavior)

They can communicate using:

    http://service-name:port

Example:

``` yaml
services:
  backend:
    image: myapp

  db:
    image: postgres
```

Backend connects to:

    db:5432

No IP address required.

------------------------------------------------------------------------

## Quick Comparison

  What You Want     CLI                       Compose
  ----------------- ------------------------- --------------------------
  Default network   Automatic                 Automatic
  Custom network    `docker network create`   Define under `networks:`
  Host mode         `--network host`          `network_mode: host`
  No network        `--network none`          `network_mode: none`
  Port mapping      `-p 8080:80`              `ports:`
