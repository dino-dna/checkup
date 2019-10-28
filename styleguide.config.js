const path = require('path')
const pkg = require('./package.json')

module.exports = {
  components: './src/web/components/**/*.{ts,tsx}',
  require: [
    path.join(__dirname, 'styleguide/globals.ts'),
    path.join(__dirname, 'src/web/global.scss'),
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
        }, {
          test: /\.png$/,
          use: [
            'url-loader',
          ]
        },
        ]
      }]
    },
    resolve: {
      alias: {
        react: 'preact/compat',
        'react-dom': 'preact/compat'
      }
    }
  },
  version: pkg.version,
}
