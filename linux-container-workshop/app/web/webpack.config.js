const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const API = process.env.API

var onError = function (err, req, res) {
  console.log('Error with webpack proxy :', err);
};

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'build.js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              'scss': 'vue-style-loader!css-loader!sass-loader',
              'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
            }
          }
        }]
      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [{
          loader: 'url-loader',
          options: {
            name: '[name].[ext]?[hash]',
            limit: 10000
          }
        }]
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue'],
    modules: [
      'node_modules'
    ],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devtool: '#eval-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        API: JSON.stringify(process.env.API),
        SITE_CODE: JSON.stringify(process.env.SITE_CODE || "JLA"),
        IMAGE_BUILD_DATE: JSON.stringify(process.env.IMAGE_BUILD_DATE || "DATE OF TAG"),
        IMAGE_TAG: JSON.stringify(process.env.IMAGE_TAG || "TAG NAME"),
        KUBE_NODE_NAME: JSON.stringify(process.env.KUBE_NODE_NAME || "NODE NAME"),
        KUBE_POD_NAME: JSON.stringify(process.env.KUBE_POD_NAME || "POD NAME"),
        KUBE_POD_IP: JSON.stringify(process.env.KUBE_POD_IP || "POD IP"),
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$|\.png$|\.jpg$|\.ico$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ],
  devServer: {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    host: '0.0.0.0',
    port: 8080,
    before(app) {
      app.use((req, res, next) => {
        console.log(`ENV IMAGE_TAG: `, process.env.IMAGE_TAG);
        console.log(`ENV IMAGE_BUILD_DATE: `, process.env.IMAGE_BUILD_DATE);
        console.log(`ENV KUBE_NODE_NAME: `, process.env.KUBE_NODE_NAME);
        console.log(`ENV KUBE_POD_NAME: `, process.env.KUBE_POD_NAME);
        console.log(`ENV KUBE_POD_IP: `, process.env.KUBE_POD_IP);
        console.log(`ENV API: `, process.env.API);
        console.log(`Using middleware for ${req.url}`);
        next();
      });
    },
    noInfo: false,
    historyApiFallback: {
      index: '/dist/'
    },
    proxy: {
      '/api': {
        target: API
      },
      onError: onError,
      logLevel: 'debug'
    }
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        API: JSON.stringify(API),
        SITE_CODE: JSON.stringify(process.env.SITE_CODE || "JLA"),
        IMAGE_TAG: JSON.stringify(process.env.IMAGE_TAG || "TESTING")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}