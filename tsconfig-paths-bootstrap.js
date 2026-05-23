// tsconfig-paths-bootstrap.js

const tsConfig = require('./tsconfig.json');
const tsConfigPaths = require('tsconfig-paths');

tsConfigPaths.register({
    baseUrl: tsConfig.compilerOptions.outDir || './dist',
    paths: tsConfig.compilerOptions.paths || {},
});
