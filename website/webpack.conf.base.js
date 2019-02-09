const webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')
  ExtractTextPlugin = require('extract-text-webpack-plugin')
  project = require('./project.json'),
  env = process.env.NODE_ENV || 'development';

module.exports = {
  entry: `${__dirname}/${project.scripts.source.entry}`,
  output: {
    path: `${__dirname}/${project.scripts.dist.root}`,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        include: [`${__dirname}/${project.scripts.source.root}`],
        use: 'html-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [
            { loader: 'css-loader', options: { minimize: true } }
          ]
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            'stylus-loader'
          ]
        })
      },
      {
        test: /\.(ttf|eot|woff|woff2|ionicons\.svg)$/,
        loader: 'file-loader',
        options: {
          name: `${project.fonts.dist.root}`,
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: project.images.dist.filename,
          context: project.images.source.context
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@environment$': `${__dirname}/${project.environments.source.root}/${env}.js`,
      '@scripts': `${__dirname}/${project.scripts.source.root}`,
      '@styles': `${__dirname}/${project.styles.source.root}`,
      '@images': `${__dirname}/${project.images.source.root}`
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: project.index.source.file,
      favicon: project.favicon.source.file,
      minify: {
        collapseWhitespace: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(env)
      }
    })
  ]
}
