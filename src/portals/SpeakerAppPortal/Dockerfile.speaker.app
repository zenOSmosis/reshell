###
# speaker.app frontend.web Dockerfile
###

FROM node:16.14
LABEL maintainer="info@zenosmosis.com"

ARG BUILD_ENV
ARG GIT_HASH
ARG SYS_USER=node
ARG SYS_GROUP=node


ENV REACT_APP_GIT_HASH="${GIT_HASH}"

RUN if [ "${BUILD_ENV}" = "production" ] ; then npm install -g serve ; fi

WORKDIR /app/frontend.web

# Build node_modules before copying rest of program in order to speed up 
# subsequent Docker builds which don't have changed package.json contents
COPY package.json ./
COPY package-lock.json ./
RUN chown -R node:node /app/frontend.web

USER "${SYS_USER}:${SYS_GROUP}"

RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  npm install --loglevel verbose \
  ; fi

# Subsequent builds usually will start here
COPY ./ ./

# Builds the Speaker.app portal after performing the following actions:
#
# - Copy shared modules from parent directory and linking them
# - Creates dynamic __registerPortals__.js file and make it writable by the
# "node" user. This fixes an issue where the dynamically written file was not
# writable by reshell-scripts.
USER root
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  rm src/portals/SpeakerAppPortal/shared \
  && mv src/portals/SpeakerAppPortal/tmp.shared src/portals/SpeakerAppPortal/shared \
  && chown -R node:node src/portals/SpeakerAppPortal/shared \
  && touch src/__registerPortals__.js \
  && chown node:node src/__registerPortals__.js \
  && npm run build SpeakerAppPortal \
  ; fi
USER "${SYS_USER}:${SYS_GROUP}"

EXPOSE 3000

# Alternative sirv utility: https://github.com/lukeed/sirv/tree/master/packages/sirv-cli

# NOTE: The -s switch rewrites all not-found requests to \`index.html\`
# @see https://github.com/vercel/serve/blob/main/bin/serve.js
CMD serve -l 3000 -s build
