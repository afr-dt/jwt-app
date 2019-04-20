## JWP APP

### Download the repository

> Install dependencies with `yarn` or `npm`

> Create a postgresql database

#### Create the .env file in the root folder with the following content

- SECRET_OR_KEY='your secret 🔑'
- PG_CONNECTION_STRING='PostgreSQL connection 🐘'

#### Run Knex migration

`knex migrate:latest`

#### And finally to run the app

`yarn start`
