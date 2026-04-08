# Running the App (MySQL Version)


---

## Step 1 — Create the backend `.env` file

## Step 2 — Start everything

```bash
docker compose -f docker-compose-sql.yml up --build -d
```

> First run takes a few minutes — Docker downloads MySQL, builds the backend and frontend images, and installs all packages.  
> The database tables are created **automatically**. You do not need to run any SQL scripts.

---

## Step 3 — Open the app

| Service  | URL                        |
|----------|----------------------------|
| Frontend | http://localhost:5173       |
| Backend  | http://localhost:3000       |
| MySQL    | localhost:3306 (root / root)|

---

## Stopping the app

```bash
# Stop containers (keeps your data)
docker compose -f docker-compose-sql.yml down

# Stop containers AND delete all data (fresh start)
docker compose -f docker-compose-sql.yml down -v
```

---

## Restarting later (no rebuild needed)

```bash
docker compose -f docker-compose-sql.yml up
```
