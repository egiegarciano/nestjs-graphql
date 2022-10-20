## Description

NestJS, GraphQL, TypeORM, MySQL

## Docker

```
docker-compose up --build -d

docker-compose exec backend npm install

docker-compose exec backend npm migration:run
```

## Running Migration

```
# Create a migration
$ npm run migration:create --name=foo

# Generate a migration from schema changes
$ npm run migration:generate --name=bar

# Run migrations and checks for schema changes
$ npm run migration:run

# Revert migrations
$ npm run migration:revert
```

## Running Seeder

```
$ docker-compose exec backend npm run seed

# Specify the seed class to run
$ docker-compose exec backend npm run seed --seed=user.seeder.ts
```
