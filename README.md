# Pickleball Weather App

Welcome to the Pickleball Weather App!

## Spinnig up the Environment

### Required Software

- NodeJS
- Docker

### Creating our Database

`sudo docker network create -d bridge piko-net`

`sudo docker run --name piko-db -p 5432:5432 --network=piko-net -e POSTGRES_DB=piko-db -e POSTGRES_USER=piko -e POSTGRES_PASSWORD=pikopw -v piko-db:/var/lib/postgresql/data -d postgres`

`sudo docker run --name pgadmin -p 8080:80 --network=piko-net -e PGADMIN_DEFAULT_EMAIL=piko@bt.com -e PGADMIN_DEFAULT_PASSWORD=pikopw -v pgadmin-data:/var/lib/pgadmin -d dpage/pgadmin4`

### Starting NextJs

`npm run dev`
