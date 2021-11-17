#! /bin/sh

semantic-release -d | tee semantic-release-output.txt

version=$(cat semantic-release-output.txt | grep "The next release version is" | rev | cut -d' ' -f1 | rev)

if [ ! -z "$version" ]; then
  echo "::set-output name=released-version::v$version"
  echo "::set-output name=released-version-number::$version"
fi
