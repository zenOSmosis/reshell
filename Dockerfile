# IMPORTANT! This Dockerfile only straps in the frontend environment and does not include Hostbridge support at this time

FROM node:14

WORKDIR /app

COPY . ./

RUN npm install --loglevel verbose

USER node

EXPOSE 3000

# NOTE: The -s switch rewrites all not-found requests to \`index.html\`
# @see https://github.com/vercel/serve/blob/main/bin/serve.js
CMD serve -l 3000 -s build