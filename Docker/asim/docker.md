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
docker exec -it database mysql -u asim -p
```

## To run MySQL database inside docker along without a persistent storage

```bash
docker run -d --rm --name database1 -p 3306:3306 -e MYSQL_ROOT_PASSWORD=pass -e MYSQL_DATABASE=pflab -e MYSQL_USER=asim -e MYSQL_PASSWORD=pass1 mysql
```

```bash
docker exec -it database1 mysql -u asim -p
```

## mysql create a test table

```sql
CREATE TABLE test (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
show tables;
```

---

# LAB4 – Docker MySQL Persistence Test

---

# ✅ PART 1 — Persistent Database (With Volume)

## 1. Create Volume

```bash
docker volume create pflab
```

---

## 2. Run MySQL Container (Persistent)

```bash
docker run -d --rm --name database \
-p 3306:3306 \
-e MYSQL_ROOT_PASSWORD=pass \
-e MYSQL_DATABASE=pflab \
-e MYSQL_USER=asim \
-e MYSQL_PASSWORD=pass1 \
-v pflab:/var/lib/mysql \
mysql
```

---

## 3. Enter MySQL

```bash
docker exec -it database mysql -u asim -p
```

Password:

```
pass1
```

---

## 4. Create Table

```sql
USE pflab;

CREATE TABLE test (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

SHOW TABLES;
```

Exit:

```bash
exit
```

---

## 5. Stop Container

```bash
docker stop database
```

---

## 6. Start Container Again

```bash
docker start database
```

---

## 7. Check Table Exists

```bash
docker exec -it database mysql -u asim -p
```

```sql
USE pflab;
SHOW TABLES;
```

---

---

# ❌ PART 2 — Non-Persistent Database (Without Volume)

---

## 1. Run MySQL Container (No Volume)

```bash
docker run -d --name database1 \
-p 3307:3306 \
-e MYSQL_ROOT_PASSWORD=pass \
-e MYSQL_DATABASE=pflab \
-e MYSQL_USER=asim \
-e MYSQL_PASSWORD=pass1 \
mysql
```

---

## 2. Enter MySQL

```bash
docker exec -it database1 mysql -u asim -p
```

Password:

```
pass1
```

---

## 3. Create Table

```sql
USE pflab;

CREATE TABLE test (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100)
);

SHOW TABLES;
```

Exit:

```bash
exit
```

---

## 4. Remove Container

```bash
docker rm -f database1
```

---

## 5. Run Container Again

```bash
docker run -d --name database1 \
-p 3307:3306 \
-e MYSQL_ROOT_PASSWORD=pass \
-e MYSQL_DATABASE=pflab \
-e MYSQL_USER=asim \
-e MYSQL_PASSWORD=pass1 \
mysql
```

---

## 6. Check Table

```bash
docker exec -it database1 mysql -u asim -p
```

```sql
USE pflab;
SHOW TABLES;
```
