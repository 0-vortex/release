# @semantic-release/apm-config

[**semantic-release**](https://github.com/semantic-release/semantic-release) shareable config to publish to `npm` and/or `ghcr`.

## Plugins

This shareable configuration use the following plugins:

- [`conventional-changelog-conventionalcommits`](https://github.com/conventional-changelog/conventional-changelog)
- [`@semantic-release/commit-analyzer`](https://github.com/semantic-release/commit-analyzer)
- [`@semantic-release/release-notes-generator`](https://github.com/semantic-release/release-notes-generator)
- [`@semantic-release/changelog`](https://github.com/semantic-release/changelog)
- [`@semantic-release/npm`](https://github.com/semantic-release/npm)
- [`@semantic-release/git`](https://github.com/semantic-release/git)
- [`@semantic-release/github`](https://github.com/semantic-release/github)
- [`@eclass/semantic-release-docker`](https://github.com/eclass/semantic-release-docker)

## Install

```bash
$ npm install --save-dev semantic-release demo-test-artifact-2
```

## Usage

The shareable config can be configured in the [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "extends": "demo-test-artifact-2"
}
```

## Configuration

See each [plugin](#plugins) documentation for required installation and configuration steps.
