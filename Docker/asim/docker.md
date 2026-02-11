# PF LAB 3

# LAB 4
## to run a container of to stop
- stop
```bash
docker stop database

```
- start
```bash
docker start database

```
## to remove containers that are not running 
```bash
docker container prune
```
## to stop every running container
```bash
docker stop $(docker ps -q)
```

## to check logs in docker
```bash
docker logs database
```
## Docker run commands

```bash
docker run --rm --name front -p 5173:5173 pflabfront npm run dev -- --host

docker run --rm --name pflab -p 3000:3000 pflab
```

## to create a persistent volume in docker

```bash
docker volume create pflab
```

## To run MySQL database inside docker along with a persistent storage

```bash
docker run -d --rm --name database -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=pflab -e MYSQL_USER=asim -e MYSQL_PASSWORD=pass1 -v pflab:/var/lib/mysql mysql
```

## To go inside a running docker container bash
```bash
docker exec -it database bash
```

## To run MySQL database inside docker along without a persistent storage

```bash
docker run -d --rm --name database1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=pflab -e MYSQL_USER=asim -e MYSQL_PASSWORD=pass1 mysql
```


# Without --rm
## To run MySQL database inside docker along with a persistent storage

```bash
docker run -d --name database -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=pflab -e MYSQL_USER=asim -e MYSQL_PASSWORD=pass1 -v pflab:/var/lib/mysql mysql
```

## To go inside a running docker container bash
```bash
docker exec -it database bash
```

## To run MySQL database inside docker along without a persistent storage

```bash
docker run -d --name database1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=pflab -e MYSQL_USER=asim -e MYSQL_PASSWORD=pass1 mysql
```
