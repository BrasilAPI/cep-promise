const project = require('./project.json');

module.exports = {
  "collectCoverageFrom": [project.tests.source.files],
  "coverageReporters": ["html"],
  "coverageThreshold": {
    "global": {
      "statements": 100,
      "branches": 100,
      "functions": 100,
      "lines": 100
    }
  },
  "moduleNameMapper": {
    '@vue$': 'vue/dist/vue.common.js',
    '@environment$': `<rootDir>/${project.environments.source.root}/development.js`,
    '@scripts\/(.*)$': `<rootDir>/${project.scripts.source.root}$1`,
    '@styles\/(.*)$': `<rootDir>/${project.styles.source.root}$1`,
    '@images\/(.*)$': `<rootDir>/${project.images.source.root}$1`,
    '@mocks\/(.*)$': `<rootDir>/${project.mocks.source.root}$1`,
    '^.+\\.css$': '<rootDir>/src/mocks/raw-files.js'
  },
  "setupTestFrameworkScriptFile": "<rootDir>/jest.config.vue.js",
  "transform": {
    '^.+\\.(png|styl)$': '<rootDir>/src/mocks/raw-files.js',
    "^.+\\.js$": "babel-jest",
    "^.+\\.html$": "html-loader-jest"
  }
}
