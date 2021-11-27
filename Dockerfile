FROM node:16-alpine

ENV GIT_COMMITTER_NAME="open-sauced[bot]"
ENV GIT_COMMITTER_EMAIL="63161813+open-sauced[bot]@users.noreply.github.com"

RUN apk --update --no-cache add git git-lfs jq openssh

COPY package.json /

RUN npm i -g $( jq -j '.dependencies|to_entries|map("\(.key)@\(.value) ")|.[]' /package.json )

COPY release.config.js /usr/local/lib/

RUN apk add --update make \
  && rm -rf /var/cache/apk/* \
  && rm -rf /package.json

ENTRYPOINT ["npx"]

CMD semantic-release --extends /usr/local/lib/release.config.js
