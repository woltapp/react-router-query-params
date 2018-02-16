const path = require('path');

module.exports = {
  entry: './src/index.jsx',
  output: {
    publicPath: 'lib/',
    path: path.resolve(__dirname, 'lib'),
    filename: 'react-router-query-params.js',
    sourceMapFilename: 'react-router-query-params.map',
    library: 'react-router-query-params',
    libraryTarget: 'commonjs',
  },
  externals: {
    react: 'react',
    'react-router': 'react-router',
    'react-router-dom': 'react-router-dom',
    'query-string': 'query-string',
    'react-display-name': 'react-display-name',
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          plugins: ['transform-runtime'],
        },
        exclude: /node_modules/,
      },
    ],
  },
};
