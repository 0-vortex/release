FROM node:16-alpine

RUN apk --update --no-cache add git git-lfs jq openssh

COPY package.json /

RUN npm i -g $( jq -j '.dependencies|to_entries|map("\(.key)@\(.value) ")|.[]' /package.json )
RUN npm i -g $( jq -r '.name + "@" + .version' package.json ) --ignore-scripts

RUN apk add --update make \
  && rm -rf /var/cache/apk/* \
  && rm -rf /package.json

ENTRYPOINT ["npx"]

CMD ["semantic-release"]
