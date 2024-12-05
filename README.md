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




# Match History Feature

PAGES
Match History Page
- list of matches (in a table)
  - players (on teams)
  - score
  - date

Players Page
- list all players
- click a player for more info
  - match history
  - win rate
    - titles (e.g., farmer, shitter)
- Register Players

Schedule Page
- mark dates for when people want to play
- list
- show matches that happened on a day in the day (accordion)

Nav bar

Input matches
- score page -> save match


DATA IMPLEMENTATION
Store Match History
- match_id
- Scores
  - team A score
  - team B score
- Players
  - which team
  - player-id
  - first name
- game date
Schedule (Marked Days)
- dates list


Tables
- Matches <- MatchPlayer -> Players
- Schedule (Marked Days)

🐵