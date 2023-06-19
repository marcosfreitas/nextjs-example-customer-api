FROM node:18 AS build

WORKDIR /build

COPY . .

RUN apt-get update \
  && apt-get install -y telnet net-tools dnsutils curl \
  && npm i -g @nestjs/cli \
  && npm install \
  && npm run build

## Runtime env
FROM node:18 AS runtime

ARG CACHEBUST=1

ARG SRV_DIR=/srv/app
ARG APP_PORT=22200

WORKDIR $SRV_DIR
ENV PORT=${APP_PORT}

RUN apt-get update \
  && apt-get install -y telnet net-tools dnsutils curl \
  && groupadd -g 2000 appuser \
  && useradd -r -u 2000 -g appuser appuser

COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist
COPY --from=build /build/package.json .
COPY --from=build /build/package-lock.json .

RUN chown -R appuser:appuser $SRV_DIR

EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
