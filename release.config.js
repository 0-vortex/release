const plugins = [];

plugins.push([
  "@semantic-release/commit-analyzer", {
    "preset": "conventionalcommits",
    "releaseRules": [
      {type: "build", release: "minor"},
      {type: "ci", release: "patch"},
      {type: "docs", release: "minor"},
      {type: "style", release: "patch"},
      {type: "refactor", release: "patch"},
      {type: "test", release: "patch"},
      {type: "revert", release: "patch"},
      {type: "chore", release: false}
    ],
    "parserOpts": {
      "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
    }
  }
]);

plugins.push([
  "@semantic-release/release-notes-generator", {
    "preset": "conventionalcommits",
    "parserOpts": {
      "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES", "BREAKING"]
    },
    "writerOpts": {
      "commitsSort": ["subject", "scope"]
    },
    "presetConfig": {
      types: [
        {type: 'feat', section: 'Features'},
        {type: 'feature', section: 'Features'},
        {type: 'fix', section: 'Bug Fixes'},
        {type: 'perf', section: 'Performance Improvements'},
        {type: 'revert', section: 'Reverts'},
        {type: 'docs', section: 'Documentation'},
        {type: 'style', section: 'Styles'},
        {type: 'refactor', section: 'Code Refactoring'},
        {type: 'test', section: 'Tests'},
        {type: 'build', section: 'Build System'},
        {type: 'ci', section: 'Continuous Integration'}
      ]
    }
  }
]);

plugins.push("@semantic-release/changelog");

plugins.push([
  "@semantic-release/npm", {
    "tarballDir": "pack"
  }
]);

if (!process.env.DISABLE_DOCKER) {
  const [owner, repo] = String(process.env.GITHUB_REPOSITORY).toLowerCase().split('/');

  plugins.push([
    "@semantic-release-plus/docker",
    {
      "name": {
        "registry": `ghcr.io`,
        "namespace": owner,
        "repository": repo,
        "tag": "latest"
      },
      "registry": "ghcr.io",
      "publishChannelTag": true,
    }
  ])
}

plugins.push([
  "@semantic-release/git", {
    "assets": [
      "CHANGELOG.md",
      "package.json",
      "package-lock.json",
      "npm-shrinkwrap.json",
      "public/diagram.svg"
    ],
    "message": `chore(release): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`
  }
]);

plugins.push([
  "@semantic-release/github", {
    "addReleases": 'bottom',
    "assets": [
      {
        "path": "pack/*.tgz",
        "label": "Static distribution"
      }
    ]
  }
]);

plugins.push([
  "@semantic-release/exec", {
    "successCmd": "echo 'SEMVER_VERSION=${nextRelease.version}' >> $GITHUB_ENV"
  }
]);

module.exports = {
  "branches": [
    "main",
    {
      name: 'beta',
      prerelease: true
    },
    {
      name: 'alpha',
      prerelease: true
    }
  ],
  plugins,
}
