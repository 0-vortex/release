FROM node:16-alpine

RUN apk --update --no-cache add git git-lfs jq openssh

COPY package.json /

RUN echo $( jq -r '.name' package.json ) > /tmp/extends

RUN npm i -g $( jq -j '.dependencies|to_entries|map("\(.key)@\(.value) ")|.[]' /package.json )
RUN npm i -g $( cat /tmp/extends ) --ignore-scripts

RUN apk add --update make \
  && rm -rf /var/cache/apk/* \
  && rm -rf /package.json

ENTRYPOINT ["npx"]

CMD semantic-release --extends $(cat /tmp/extends)
