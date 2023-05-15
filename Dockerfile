FROM alpine:3.17

ENV NODE_VERSION 18.16.0

RUN apk add --update  \
    git git-lfs jq openssh \
    nodejs npm

COPY package.json /

RUN npm i -g npm@latest
RUN npm i -g $( jq -j '.dependencies|to_entries|map("\(.key)@\(.value) ")|.[]' /package.json )

COPY release.config.js /usr/local/lib/release.config.js

RUN apk add --update make \
  && rm -rf /var/cache/apk/* \
  && rm -rf /package.json

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
