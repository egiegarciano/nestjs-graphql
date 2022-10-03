ARG NODE_IMAGE=node:16.0.0-alpine

FROM $NODE_IMAGE AS base
RUN mkdir -p /home/node/app && chown node:node /home/node/app
RUN npm install -g nodemon
WORKDIR /home/node/app
USER node
RUN mkdir tmp

FROM base AS backend
COPY --chown=node:node ./package*.json ./
RUN npm ci
COPY --chown=node:node ./ .

EXPOSE 11000
CMD [ "npm", "run", "start:dev" ]
