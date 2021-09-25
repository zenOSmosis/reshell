# IMPORTANT! This Dockerfile only straps in the frontend environment and does not include Hostbridge support at this time

FROM node:14

WORKDIR /app

# Build node_modules before copying rest of program in order to speed up 
# subsequent Docker builds which don't have changed package.json contents
COPY package.json ./
RUN npm install --loglevel verbose

COPY . ./

RUN npm run build

USER node

EXPOSE 3000

# NOTE: The -s switch rewrites all not-found requests to \`index.html\`
# @see https://github.com/vercel/serve/blob/main/bin/serve.js
CMD serve -l 3000 -s build