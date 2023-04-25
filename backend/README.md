# Setup local environment

## Prepare database

```sh
docker-compose up -d

## Start server
make run

## Create DB table
make migrate/init

## Seed data
make migrate/seed

## Drop all table and data
migrate/drop
```
