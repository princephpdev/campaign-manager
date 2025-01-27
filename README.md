## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## DB Setup
```bash
# db setup
$ npx prisma init --datasource-provider sqlite

# db migration
$ npx prisma migrate dev --name init

# db generate
$ npx prisma generate

# db push
# After update schema
$ npx prisma db push

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

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).
