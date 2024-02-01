module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/lib/', '/archive/', '/test-results/'],
  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: './test-results/junit',
        outputName: 'junit.xml'
      }
    ],
    [
      "jest-html-reporters",
      {
        publicPath: './test-results/html',
        filename: 'index.html',
        expand: true
      }
    ]
  ],
  collectCoverage: true,
  coverageDirectory: './test-results/coverage',
  coverageReporters: ['text', 'lcov', 'html'],
};