const plugins = [
  ["@semantic-release/commit-analyzer", {
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
  }],
  ["@semantic-release/release-notes-generator", {
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
  }],
  "@semantic-release/changelog",
  ["@semantic-release/npm", {
    "tarballDir": "pack"
  }],
  ["@semantic-release/git", {
    "assets": [
      "CHANGELOG.md",
      "package.json",
      "npm-shrinkwrap.json",
      "public/diagram.svg"
    ],
    "message": `chore(release): \${nextRelease.version} [skip ci]\n\n\${nextRelease.notes}`
  }],
  ["@semantic-release/github", {
    "assets": [
      {
        "path": "pack/*.tgz",
        "label": "Static distribution"
      }
    ]
  }],
];

!process.env.DISABLE_DOCKER && plugins.push([
  "@semantic-release-plus/docker",
  {
    "name": `ghcr.io/${process.env.GITHUB_REPOSITORY}`,
    "registry": "ghcr.io",
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
