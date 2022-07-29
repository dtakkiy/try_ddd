FROM node:14-alpine

WORKDIR /api

COPY package.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .

EXPOSE 3001
CMD ["yarn", "dev"]
