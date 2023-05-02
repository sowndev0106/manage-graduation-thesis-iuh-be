FROM node:18-alpine

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

FROM --platform=linux/arm64 node:16

RUN apt-get update \
    && apt-get install -y chromium \
    && apt-get install -y ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium

# Install Puppeteer under /node_modules so it's available system-wide
ADD package.json package-lock.json /
RUN npm install puppeteer@10.0.0

EXPOSE 3000
CMD ["npm", "run", "start", "--env", "production"]
