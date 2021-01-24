const _ = require('lodash'),
  webpackBaseConfig = require('./webpack.conf.base'),
  webpackDevConfig = require('./webpack.conf.dev'),
  webpackProdConfig = require('./webpack.conf.prod'),
  webpackEnvConfig = process.env.NODE_ENV == 'production' ? webpackProdConfig : webpackDevConfig;

module.exports = _.mergeWith(
  webpackBaseConfig,
  webpackEnvConfig,
  (baseValue, envValue) => {
    if (_.isArray(baseValue)) return baseValue.concat(envValue);
  }
);
