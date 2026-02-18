# Payment App (Docker + MySQL)

A CLI-based payment application built with Java and MySQL, fully containerized with Docker Compose.

## Features

- Sign up & Login
- Send money between accounts
- Deposit funds
- Check balance
- Change password
- **Persistent storage** — data survives container restarts

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Quick Start

```bash
# Build and run the app
docker compose run --rm cli
```

This will:
1. Pull the MySQL 8.0 image (first time only)
2. Build the Java CLI image
3. Start MySQL and wait until it's healthy
4. Launch the interactive payment app

## Other Commands

```bash
# Start MySQL in background
docker compose up -d db

# Run the CLI app
docker compose run --rm cli

# Stop all services
docker compose down

# Stop all services AND delete all data
docker compose down -v
```

## Project Structure

```
├── App.java             # Java application (Account, Repository, Service, CLI)
├── cli.dockerfile       # Dockerfile for the Java CLI app
├── docker-compose.yml   # Orchestrates MySQL + CLI containers
├── init.sql             # Database initialization script
└── README.md
```

## Architecture

```
┌─────────────┐       JDBC        ┌─────────────────┐
│   CLI App   │ ──────────────▶   │   MySQL 8.0     │
│  (Java 17)  │                   │  payment_db     │
│  container  │                   │  container      │
└─────────────┘                   └────────┬────────┘
                                           │
                                  ┌────────▼────────┐
                                  │  mysql_data     │
                                  │  (Docker volume)│
                                  └─────────────────┘
```

## MySQL Details

| Property       | Value         |
|----------------|---------------|
| Host           | `db` (internal Docker network) |
| Port           | `3306`        |
| Database       | `payment_db`  |
| Root Password  | `root`        |

> **Note**: To connect from your host machine (e.g. MySQL Workbench), use `localhost:3306`.
