<p align="center">
  <a href="https://tushar-chy.medium.com/elasticsearch-kibana-and-nestjs-dockerized-application-b81105062c2d" target="_blank"> <img src="https://res.cloudinary.com/ecredit/image/upload/v1548844004/implement-elasticsearch-using-nestjsArtboard_1_4x_xhmtho.png" alt="Nest Logo" /></a>
</p>

## Description

A simple TODO application under Docker environment.
* NestJS
* TypeORM
* PostgreSQL
* Swagger
* PGadmin4
* JWT
* Docker
* Elasticsearch
* Kibana

Go to [Medium](https://tushar-chy.medium.com/elasticsearch-kibana-and-nestjs-dockerized-application-b81105062c2d) to get the full tutorial.

# Running the app on docker
## Docker build & start

```bash
# docker env build
$ docker-compose build

# docker env start
$ docker-compose up

# remove docker container (services & networks)
$ docker-compose down
```
## Migration

```bash
# generate migration
$ docker-compose run nestjs npm run typeorm:generate AnyNameYouLike

# run migration
$ docker-compose run nestjs npm run typeorm:run
```

# Running the app without docker
## Installation

```bash
$ npm install
```
## Migration

```bash
# generate migration
$ npm run typeorm:generate AnyNameYouLike

# run migration
$ npm run typeorm:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
