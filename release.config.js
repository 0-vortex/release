const { existsSync } = require('fs');

const {
  GITHUB_REPOSITORY_OWNER,
  GITHUB_REPOSITORY,
  GITHUB_TOKEN,
  DOCKER_USERNAME,
  DOCKER_PASSWORD,
  GIT_COMMITTER_NAME,
  GIT_COMMITTER_EMAIL,
} = process.env;

console.log(process.env);

!GIT_COMMITTER_NAME && (process.env.GIT_COMMITTER_NAME = "open-sauced[bot]");
!GIT_COMMITTER_EMAIL && (process.env.GIT_COMMITTER_EMAIL = "63161813+open-sauced[bot]@users.noreply.github.com");

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

try {
  const dockerExists = existsSync('./Dockerfile');

  if (dockerExists) {
    const [owner, repo] = String(GITHUB_REPOSITORY).toLowerCase().split('/');

    !DOCKER_USERNAME && (process.env.DOCKER_USERNAME = GITHUB_REPOSITORY_OWNER);
    !DOCKER_PASSWORD && (process.env.DOCKER_PASSWORD = GITHUB_TOKEN);

    plugins.push([
      "semantic-release-docker-mini",
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
    ]);
  }
} catch(err) {
  console.error(err);
}

plugins.push([
  "@semantic-release/exec", {
    // "verifyConditionsCmd": "echo '${GITHUB_SHA}'",
    "verifyConditionsCmd": "echo 'TEST_AUTHOR_NAME=$(git log -1 --pretty=format:\"%an\" ${GITHUB_SHA})' >> $GITHUB_ENV",
    "successCmd": "echo 'SEMVER_VERSION=${nextRelease.version}' >> $GITHUB_ENV"
  }
]);

console.log(process.env.TEST_AUTHOR_NAME);

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
