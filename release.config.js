const { existsSync } = require("fs");
const { sync, commandSync } = require("execa");
const log = require("npmlog");

const plugins = [];
const noteKeywords = [
  "BREAKING CHANGE",
  "BREAKING CHANGES",
  "BREAKING"
];
const {
  GITHUB_SHA,
  GITHUB_REPOSITORY,
  GIT_COMMITTER_NAME,
  GIT_COMMITTER_EMAIL,
  GIT_AUTHOR_NAME,
  GIT_AUTHOR_EMAIL,
} = process.env;
const successCmd = `
echo 'RELEASE_TAG=v\${nextRelease.version}' >> $GITHUB_ENV
echo 'RELEASE_VERSION=\${nextRelease.version}' >> $GITHUB_ENV
echo '::set-output name=release-tag::v\${nextRelease.version}'
echo '::set-output name=release-version::\${nextRelease.version}'
`;
const [owner, repo] = String(GITHUB_REPOSITORY).toLowerCase().split("/");
const addPlugin = (plugin, options) => {
  log.info(`${plugin} enabled ${options && 'with options:'}`);
  options && log.info(null, options);
  return plugins.push([plugin, options]);
};

log.info(`Executing semantic-release config setup`);

!GIT_COMMITTER_NAME && (process.env.GIT_COMMITTER_NAME = "open-sauced[bot]");
!GIT_COMMITTER_EMAIL && (process.env.GIT_COMMITTER_EMAIL = "63161813+open-sauced[bot]@users.noreply.github.com");

addPlugin("@semantic-release/commit-analyzer", {
  "preset": "conventionalcommits",
  "releaseRules": [
    // {type: "feat", release: "minor"},
    // {type: "fix", release: "patch"},
    // {type: "perf", release: "patch"},
    {type: "build", release: "patch"},
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
});

addPlugin("@semantic-release/release-notes-generator", {
  "preset": "conventionalcommits",
  "releaseRules": [
    {type: "feat", release: "minor"},
    {type: "fix", release: "patch"},
    {type: "perf", release: "patch"},
    {type: "revert", release: "patch"},
    {type: "docs", release: "minor"},
    {type: "style", release: "patch"},
    {type: "refactor", release: "patch"},
    {type: "test", release: "patch"},
    {type: "build", release: "patch"},
    {type: "ci", release: "patch"},
    {type: "chore", release: false}
  ],
  "parserOpts": {
    noteKeywords
  }
});

addPlugin("@semantic-release/changelog");

addPlugin("@semantic-release/npm", {
  "tarballDir": "pack"
});

addPlugin("@semantic-release/git", {
  "assets": [
    "CHANGELOG.md",
    "package.json",
    "npm-shrinkwrap.json",
    "public/diagram.svg"
  ],
  "message": `chore(release): \${nextRelease.version}\n\n\${nextRelease.notes}`
});

addPlugin("@semantic-release/github", {
  "assets": [
    {
      "path": "pack/*.tgz",
      "label": "Static distribution"
    }
  ]
});

module.exports = {
  "branches": [
    // maintenance releases
    // "+([0-9])?(.{+([0-9]),x}).x",

    // release channels
    "main",
    "next",
    "next-major",

    // pre-releases
    {
      name: "beta",
      prerelease: true
    },
    {
      name: "alpha",
      prerelease: true
    }
  ],
  plugins,
}
