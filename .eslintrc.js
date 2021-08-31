module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': 0,
    'spaced-comment': 0,
    'space-before-function-paren': 0,
    'space-in-parens': 0,
    'no-trailing-spaces': 0,
    'no-useless-escape': 0,
    'one-var': 0
  }
}
