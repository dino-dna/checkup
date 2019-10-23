const path = require('path')
const pkg = require('./package.json')

module.exports = {
  components: './src/web/components/**/*.{ts,tsx}',
  require: [
    path.join(__dirname, 'src/web/icons.min.css')
  ],
  title: pkg.title,
  webpackConfig: {
    module: {
      rules: [{
        oneOf: [{
          exclude: /node_modules/,
          loader: 'babel-loader',
          test: /\.tsx?$/,
        }, {
          test: /\.s?css$/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader',
          ]
        }]
      }]
    },
    resolve: {
      alias: pkg.alias
    }
  },
  version: pkg.version,
}
