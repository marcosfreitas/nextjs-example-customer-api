<br>
<p align="center">
<img src="https://nestjs.com/img/logo_text.svg" width="80">
</p>

<p align="center">Project built with NestJS Framework.</p>

## Description

This project was built with TypeScript and Node.JS (minimum version 18).

All basic configurations have been made to:

- Perform code quality checks (using **eslint** and **prettier**)
- Improve code quality during development using **TypeScript** and compiling to **JavaScript**.

The project dependencies can be seen in the `package.json` file;

Automated tests have been implemented using **Jest** to test the **unit** behavior of classes, other tests such as integration and E2E were not added.

## DDD

The project is intentionally organized following the Domain-Driven-Design pattern, aiming at maintenance and extensibility of the project. Therefore, I did not add the "modules" folder that centralized module creation.

The goal is to orchestrate the project architecture according to the organization's contexts and domains. In this case, our only context is "Customers", but it is easy to scale and add new domains or contexts according to the existing layers in the project:

```diff
./src
+  - application
  The application layer is responsible for housing the use cases (logic before business rules) and dispatching processing to related domain services.
+  - domain
  For each domain, there is a NestJS module. In the domain layer, we can put the actual business rule, which requires structures like repositories, infrastructure components, etc., to perform operations.
+  - infrastructure
  Modules can also be an important and reusable part present in other layers of the application, for example, in infrastructure, we have the cache module.
+  - interfaces/http/controllers
  The interface layer is responsible for the relationship with the outside world.
+./test
  In the test folder, we have coverage reports and .http files for manual execution of requests. Here we can extend to have integration and E2E tests.
```
## Features

This project implements the Customers API with the following functionalities:
- [x] Customer Creation;
- [x] Listing customer data by UUID;
- [X] Updating customer data by UUID;


Below are some information about running the application and how you can use it.

## Environment Variables

The system needs some environment variables, some of them are configured but not actually used, such as the database variables.


Rename the `.env.example` file to `.env` in the root of the project before execution.


```diff
APP_NAME=CUSTOMER_API

NODE_ENV=dev
APP_VERSION=1.0.0
APP_PORT=3000
APP_DEBUGGER_PORT=8000

SSO_AUTH_URL="https://sso-server.xyz/oauth2/"

REDIS_HOST=cache
REDIS_PORT=6379
REDIS_PASSWORD=

CACHE_TTL=9999999
```

## Dependencies

The project is using **NPM** for dependency management.

However, when running the project, the entire environment will be prepared automatically.

To install manually, execute:

```bash
$ npm run install
```

## Available Commands

These are the available commands to execute the project in the appropriate environment. **Preferably run them inside the Docker container.**

```bash
# runs the project in development mode
$ npm run start

# runs the project in development mode with "watch mode"
$ npm run start:dev

# runs the project in production mode
$ npm run start:prod

# runs unit tests
$ npm run tests

# runs unit tests with coverage report
$ npm run tests:cov

# compile typescript
$ npm run build

# run lint
$ npm run lint

```

Other commands are available in the `package.json` file.

### Running the project with Docker Compose

There is the `docker-compose.dev.yml` file for development purposes that uses the Dockerfile of the application as a base, where the entire environment is prepared, and the application runs in production state.

A possible deployment would use the Dockerfile or a new docker-compose.yml.

```bash
# there is the docker-compose.dev.yml file to run the project in development mode
$ docker-compose -f docker-compose.dev.yml up

# to remove the container, image, and volume related to this project:
$ docker-compose -f docker-compose.dev.yml down -v --rmi all

# if you encounter problems, it is interesting to run the above command and rebuild the image without cache, after that you can bring the container up again
$ docker-compose -f docker-compose.dev.yml build --no-cache
```

#### Available Endpoints

When running the project, it will be available at `localhost:3000`.

- [x] `(POST) /customers`
- [x] `(GET) /customers/:uuid`
- [x] `(PUT) /customers/:uuid`

To consume the endpoints, you need to pass the authorization token received from the SSO API.
Check the test folder for examples of requests, before consuming the application, obtain the token as done in the `sso-auth.http` file.

```
./test/requests
  create-customer.http
  get-customer.http
  sso-auth.http
  sso-discovery-endpoint.http
  sso-token-introspection.http
  sso-userinfo.http
  update-customer.http
```

#### Redis

To access Redis, you need to access the docker container:

```
docker exec -it cache /bin/bash
```

To access the records, you will need to use redis-cli or another method of your choice, but remember that a password was defined in the .env file.

```
redis-cli --pass YOUR_PASSWORD
```

# Notes

As the project structure is quite simple, I did not add integration and E2E tests, however, the goal of testing the components' behavior of the classes was achieved with unit tests.

With the support of test coverage, after running `npm run test:cov`, we can see that there are files not covered by tests, this was intentional. I focused only on building tests for the main components related to the project's business rule, but also just to demonstrate the knowledge.
