# PF Lab Project Web App

## Current Members
* Apoorva Singh
* Mihir Kumar
* Asim Kumar Mahata
* Aditya Raj

## Docker

```bash
docker network create pflab-network
docker compose -f docker-compose.db.yml up -d
docker compose up -d
```

Add this in `backend/.env`:
```
MONGO_URI=mongodb://admin:pass@pflab-mongodb:27017/pflab?authSource=admin
```
