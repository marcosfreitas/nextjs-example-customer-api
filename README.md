
## Marcos Vinícius Silva de Freitas
<br>
<p align="center">
<img src="https://nestjs.com/img/logo_text.svg" width="80">
</p>

<p align="center">Project built with NestJS Framework.</p>

## Descrição

Este projeto foi construído com TypeScript e Node.JS (versão mínima 18).

Todas as configurações básicas foram feitas para:

- realizar a verificação de qualidade de código (usando o **eslint** e **prettier**)
- dar mais qualidade ao código em desenvolvimento utilizando **TypeScript** e compilando para **Javascript**.

As dependências do projeto podem ser vistas no arquivo `package.json`;

Foram implementados testes automáticos usando o **Jest** para testar o comportamento **unitário** das classes, outros testes como de integração e E2E não foram adicionados.

## DDD

O projeto está propositalmente organizado seguindo o padrão Domain-Driven-Design, visando manutenção e extensibilidade do projeto. Portando, não adicionei a pasta "modules" que centralizava a criação dos módulos.

O objetivo é orquestrar a arquitetura do projeto de acordo com os contextos e domínios da organização. Nesse caso nosso único contexto é o "Customers", porém fica fácil escalarmos e adicionarmos novos domínios ou contextos de acordo com as camadas existentes no projeto:

```diff
./src
+  - application
  a camada de aplicação é responsável por abrigar os casos de uso (lógica antes das regras de negócio) e despachar o processamento para os serviços do domínio relacionado.
+  - domain
  para cada domínio há um módulo do NestJS. Na camada de domínio podemos colocar a regra de negócio propriamente dita, essa solicita estruturaas como repositórios, componentes de infraestrutura, etc, para realizar as operações.
+  - infrastructure
  os módulos também podem ser uma parte importante e reutilizável presente em outras camadas da aplicação, por exemplo em infraestrutura temos o módulo de cache.
+  - interfaces/http/controllers
  a camada de interface é responsável pelo relacionamento com o mundo exterior.
+./test
  na pasta de testes temos os relatórios de cobertura e arquivos do tipo .http para execução manual de requisições. Aqui podemos extender para termos testes de integração e E2E.
```
## Features

Este projeto implementa a API Customers com as funcionalidades a seguir:
- [x] Criação;
- [x] Listagem de dados de um cliente por UUID;
- [X] Atualização dos dados de um cliente por UUID;


A seguir, algumas informações sobre a execução da aplicação e como você pode usá-la.

## Variáveis de Ambiente

O sistema precisa de alguma variáveis de ambiente, parte delas estão configuradas mas de fato não são utilizadas, como é o caso das variáveis de banco de dados.


Renomeie o arquivo `.env.example` para `.env` na raiz do projeto antes da execução.


```diff
APP_NAME=CUSTOMER_API

NODE_ENV=dev
APP_VERSION=1.0.0
APP_PORT=3000
APP_DEBUGGER_PORT=8000

SSO_AUTH_URL="https://accounts.seguros.vitta.com.br/auth/realms/careers/protocol/openid-connect"

REDIS_HOST=cache
REDIS_PORT=6379
REDIS_PASSWORD=

CACHE_TTL=9999999
```

## Dependências

O projeto está utilizando o **NPM** para gerenciamento de dependências.

Contudo, veremos que ao rodar o projeto todo o ambiente será preparado sozinho.

Para instalar manualmente execute:

```bash
$ npm run install
```

## Comandos disponíveis

Estes são os comandos disponíveis para executar o projeto no ambiente adequado.

```bash
# executa o projeto em modo de desenvolvimento
$ npm run start

# executa o projeto em modo de desenvolvimento com "watch mode"
$ npm run start:dev

# executa o projeto em modo de produção
$ npm run start:prod

# executa os testes unitários
$ npm run tests

# executa os testes unitários com relatório de cobertura
$ npm run tests:cov

# compilar o typescript
$ npm run build

# executar o lint
$ npm run lint

```

Outros comandos estão disponíveis no arquivo `package.json`.

### Executando o projeto com Docker Compose
```bash
# há o arquivo docker-compose.dev.yml para executar o projeto em modo de desenvolvimento
$ docker-compose -f docker-compose.dev.yml up

# para remover o container, imagem e volume relacionados a este projeto:
$ docker-compose -f docker-compose.dev.yml down -v --rmi all

# se você tiver problemas é interessante rodar o comando acima e reconstruir a imagem sem cache, após isso você pode subir o container novamente
$ docker-compose -f docker-compose.dev.yml build --no-cache
```

#### Endpoints disponíveis

Ao executar o projeto ele estará disponível no `localhost:3000`.

- [x] `(POST) /customers`
- [x] `(GET) /customers/:uuid`
- [x] `(PUT) /customers/:uuid`

Para consumir os endpoints você precisar passar o token de autorização recebido da API do SSO.
Observe na pasta de testes os exemplos de requisições, antes de consumir a aplicação obtenha o token como é feito no arquivo `sso-auth.http`.

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

Para acessar o redis, você precisar acessar o container docker:

```
docker exec -it cache /bin/bash
```

Já para acessar os registros, você precisará utilizar o redis-cli ou outra forma de sua preferência, mas lembre-se que foi definida uma senha no arquivo .env.

```
redis-cli --pass SUA_SENHA
```

# Notas

Como a estrutura do projeto é bem simples, não adicionei testes de integração e E2E, contudo o objetivo de testar o comportamento dos componentes das classes foi atingido com os testes unitários.

Com o apoio da cobertura dos testes, após executar o `npm run test:cov`, podemos ver que há arquivos não cobertos pelos testes, isso foi proposital. Foquei apenas em construir testes para os componentes principais que estavam relacionados à regra de negócio do projeto, mas também apenas para demonstrar o conhecimento.
