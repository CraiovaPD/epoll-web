'use strict';

const nodeResolve = require('rollup-plugin-node-resolve');
const alias = require('rollup-plugin-alias');
const commonjs = require('rollup-plugin-commonjs');
const json = require('rollup-plugin-json');

// Beware of:
// https://github.com/maxdavidson/rollup-plugin-sourcemaps/issues/33

module.exports = {
  input: 'src/client/main.aot.js', // entry point for the application
  output: {
    file: 'build/client/main.bundle.es2015.js',
    format: 'iife', // ready-to-execute form, to put on a page
  },
  options: {
    useStrict: true
  },
  onwarn: function (warning) {
    // Skip certain warnings
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    console.warn(warning.message);
  },
  plugins: [
    json({
      // All JSON files will be parsed by default,
      // but you can also specifically include/exclude files
      include: [
        'node_modules/moment/locale/**',
        'node_modules/moment-timezone/**',
      ],
      // for tree-shaking, properties will be declared as
      // variables, using either `var` or `const`
      preferConst: true, // Default: false
      // specify indentation for the generated default export —
      // defaults to '\t'
      indent: '  '
    }),
    alias({
      // rxjs: __dirname + '/node_modules/rxjs-es',
      'moment/locale/ro': __dirname + '/node_modules/moment/locale/ro.js',
      moment: __dirname + '/node_modules/moment/moment.js',
      // 'epoll-api-sdk': __dirname + '/node_modules/epoll-api-sdk/build/index.js'
    }),
    nodeResolve({
      es2015: true,  // Use new Angular es2015.
      module: true, // skip the ES5-in-ES2015 modules we aren't using.
      browser: true,  // Not needed for this example, needed for certain libs
      main: true,
      jsnext: true
    }),
    commonjs({
      namedExports: {
        [__dirname + '/node_modules/exceptional.js']: ['ServerException', 'ClientException']
      }
    })
  ]
}
