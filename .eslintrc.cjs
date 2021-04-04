module.exports = {
    env: {
        es6: true,
        node: true
    },
    extends: ['eslint:recommended'],
    
    rules: {
        'no-console': 'error',
        curly: ['error', 'all'],
        'prefer-arrow-callback': 'error',
        'one-var': ['error', 'never'],
        'no-var': 'error',
        'prefer-const': 'error'
    },
    parser: "@babel/eslint-parser",
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        ecmaFeatures: {
            globalReturn: false,
        },
        babelOptions: {
            configFile: __dirname+"/babel.config.json",
        },
        
    }
};
