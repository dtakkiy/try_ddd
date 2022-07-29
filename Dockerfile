FROM --platform=linux/x86_64 node:14-alpine

WORKDIR /api

COPY package.json yarn.lock ./

RUN yarn

COPY . .

EXPOSE 3001

ENTRYPOINT [ "yarn", "dev" ]

