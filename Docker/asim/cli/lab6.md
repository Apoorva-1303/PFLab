
# Lab 6 — Payment App with Docker & MySQL

## What Did We Do?

We took a simple Java payment app and made it work inside **Docker containers** with a **real database (MySQL)** so that all the data is saved even when we restart everything.

---

## Step-by-Step Explanation

### Step 1: We Had a Simple Java App

Imagine you have a notebook where you write down everyone's bank account info — their name, email, password, and how much money they have. That's what our app was doing, but instead of a notebook, it was saving everything in a plain text file called `accounts.txt`.

**Problem:** Text files are fragile. If two programs try to write at the same time, things can break. And it's hard to search or organize data in a text file. We needed something better — a **database**.

---

### Step 2: We Switched to MySQL (A Real Database)

Think of MySQL like a super-organized filing cabinet. Instead of scribbling notes in a text file, we now neatly store each account in a proper table with rows and columns — just like a spreadsheet.

**What we changed in `App.java`:**

- **Before:** The app would read/write from `accounts.txt` using basic file reading.
- **After:** The app talks to MySQL using something called **JDBC** (think of it as a phone line between Java and the database). Every time you sign up, deposit money, or send money, it updates the database directly.

We also added **retry logic** — if MySQL isn't ready yet, the app keeps trying to connect (up to 30 times, waiting 2 seconds between each try) instead of just crashing.

---

### Step 3: We Created `init.sql` (Setting Up the Database)

When MySQL starts for the very first time, it needs to know what database and tables to create. `init.sql` is like giving MySQL a to-do list on its first day:

> "Hey MySQL, create a database called `payment_db`, and inside it, create a table called `accounts` with columns for account ID, name, email, password, and balance."

MySQL only runs this file the **first time**. After that, it remembers everything.

---

### Step 4: We Created a Dockerfile (`cli.dockerfile`)

A **Dockerfile** is like a recipe for building a lunchbox. It tells Docker:

1. **Start with Java 17** (the base)
2. **Download the MySQL connector** — a special JAR file that lets Java talk to MySQL (like downloading a translator app)
3. **Copy our `App.java`** into the container
4. **Compile it** with `javac` (turn the code into something the computer can run)
5. **Run it** with `java` when the container starts

---

### Step 5: We Set Up Docker Compose (`docker-compose.yml`)

Docker Compose is like a **team manager**. Instead of starting MySQL and the app separately, we tell Docker Compose: _"Here are my two workers (services). Start them both and make sure they can talk to each other."_

**Our two services:**

| Service | What It Does |
|---------|--------------|
| `db`    | Runs MySQL — the database that stores all account data |
| `cli`   | Runs our Java payment app — the thing you interact with |

**Important things we set up:**

- **`depends_on` with healthcheck** — The app waits until MySQL is fully ready before trying to connect. It's like waiting for the restaurant kitchen to open before placing your order.
- **`mysql_data` volume** — This is like a USB drive that MySQL saves its data to. Even if you turn off the containers, the data stays on this "USB drive". Next time you start up, all accounts are still there!
- **`stdin_open: true` and `tty: true`** — These let you type into the app. Without them, the app would start but you couldn't interact with it (like a phone call where you can hear but can't speak).

---

### Step 6: We Made the Data Persistent

**Persistent** means "it doesn't disappear". Without a volume, every time you stop the MySQL container, all data would be lost — like writing on a whiteboard and then erasing it.

With the `mysql_data` **Docker volume**, the data is saved on your computer's hard drive. You can:

- ✅ `docker compose down` → containers stop, **data stays**
- ❌ `docker compose down -v` → containers stop, **data is deleted**

---

## Summary

| What | Before | After |
|------|--------|-------|
| Storage | `accounts.txt` (text file) | MySQL database |
| Running | `javac App.java && java App` on your machine | `docker compose run --rm cli` in containers |
| Data persistence | Only if you don't delete the file | Saved in a Docker volume |
| Dependencies | Just Java | Java + MySQL, managed by Docker Compose |

---

## Files We Created / Modified

| File | What It Does |
|------|--------------|
| `App.java` | The payment app — now talks to MySQL instead of a text file |
| `init.sql` | Tells MySQL what database and table to create on first startup |
| `cli.dockerfile` | Recipe for building the Java app container |
| `docker-compose.yml` | Manages both MySQL and the app as a team |
| `README.md` | Instructions on how to run everything |
