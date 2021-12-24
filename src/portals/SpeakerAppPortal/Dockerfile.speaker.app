###
# speaker.app frontend.web Dockerfile
###

FROM node:14
LABEL maintainer="jeremy.harris@zenosmosis.com"

ARG BUILD_ENV
ARG GIT_HASH

ENV REACT_APP_GIT_HASH="${GIT_HASH}"

RUN if [ "${BUILD_ENV}" = "production" ] ; then npm install -g serve ; fi

WORKDIR /app/frontend.web

# Build node_modules before copying rest of program in order to speed up 
# subsequent Docker builds which don't have changed package.json contents
#
# IMPORTANT: Development modules have to be installed here or the FE can't
# build
COPY package.json ./
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  chown -R node /app \
  && npm install --loglevel verbose \
  ; fi

# Subsequent builds usually will start here
COPY ./ ./

# Copy shared modules from parent directory
#
# Also builds .cache directory, which is needed by the CRA build process
RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  rm src/portals/SpeakerAppPortal/shared \
  && mv src/portals/SpeakerAppPortal/tmp.shared src/portals/SpeakerAppPortal/shared \
  && mkdir -p /app/frontend.web/node_modules/.cache \
  && chown -R node /app/frontend.web/node_modules/.cache \
  ; fi

USER node

RUN if [ "${BUILD_ENV}" = "production" ] ; then \
  npm run build \
  ; fi

EXPOSE 3000

# Alternative sirv utility: https://github.com/lukeed/sirv/tree/master/packages/sirv-cli

# NOTE: The -s switch rewrites all not-found requests to \`index.html\`
# @see https://github.com/vercel/serve/blob/main/bin/serve.js
CMD serve -l 3000 -s build
