###
# speaker.app frontend.web Dockerfile
###

FROM node:16.14
LABEL maintainer="info@zenosmosis.com"

ARG BUILD_ENV
ARG GIT_HASH

ENV REACT_APP_GIT_HASH="${GIT_HASH}"

RUN if [ "${BUILD_ENV}" = "production" ] ; then npm install -g serve ; fi

WORKDIR /app/frontend.web

RUN chown -R node /app

USER node

# Build node_modules before copying rest of program in order to speed up 
# subsequent Docker builds which don't have changed package.json contents
#
# IMPORTANT: Development modules have to be installed here or the FE can't
# build
COPY package.json ./
COPY package-lock.json ./
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  npm install --loglevel verbose \
  ; fi

# Subsequent builds usually will start here
COPY ./ ./

# Copy shared modules from parent directory
#
# Also builds .cache directory, which is needed by the CRA build process
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  rm src/portals/SpeakerAppPortal/shared \
  && mv src/portals/SpeakerAppPortal/tmp.shared src/portals/SpeakerAppPortal/shared \
  ; fi

# Create dynamic __registerPortals__.js file and make it writable by the "node"
# user. This fixes an issue where the dynamically written file was not writable
# by reshell-scripts.
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  touch src/__registerPortals__.js && chown node src/__registerPortals__.js \
  ; fi

RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  npm run build SpeakerAppPortal \
  ; fi

EXPOSE 3000

# Alternative sirv utility: https://github.com/lukeed/sirv/tree/master/packages/sirv-cli

# NOTE: The -s switch rewrites all not-found requests to \`index.html\`
# @see https://github.com/vercel/serve/blob/main/bin/serve.js
CMD serve -l 3000 -s build
