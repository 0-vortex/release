#!/bin/sh -l

ls -lahH
whoami
pwd

#time=$(date)
#echo "time=$time" >> $GITHUB_OUTPUT
npx semantic-release --extends /usr/local/lib/release.config.js
