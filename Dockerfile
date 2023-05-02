FROM node:18-alpine

ENV NODE_ENV="develop"
WORKDIR /app
COPY package.json .
COPY package-lock.json . /app/

ARG BUILD_ENV
COPY . .
RUN curl -LO https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt-get install -y ./google-chrome-stable_current_amd64.deb
RUN rm google-chrome-stable_current_amd64.deb 
RUN npm ci
RUN npm run build
RUN chown -R node /app/node_modules

EXPOSE 3000
CMD ["npm", "run", "start", "--env", "production"]
