module.exports = {
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  },
  verbose: true,
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  transformIgnorePatterns: [
    './node_modules',
    './packages/dubbo/src/__tests__/providers'
  ],
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
}
