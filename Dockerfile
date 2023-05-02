FROM node:18-alpine

# Installs latest Chromium (100) package.
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    yarn


ENV NODE_ENV="develop"
WORKDIR /app
COPY package.json .
COPY package-lock.json . /app/

ARG BUILD_ENV
COPY . .
RUN apt-get install chromium-browser
RUN npm ci
RUN npm run build
RUN chown -R node /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start", "--env", "production"]
