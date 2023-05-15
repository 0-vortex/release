#!/bin/sh -l

ls -lahH
whoami
pwd

echo "$GITHUB_WORKSPACE"
git config --global --add safe.directory "$GITHUB_WORKSPACE"

#time=$(date)
#echo "time=$time" >> $GITHUB_OUTPUT
npx semantic-release --extends /usr/local/lib/release.config.js
