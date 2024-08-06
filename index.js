const fp = require('fastify-plugin');
const merge = require('lodash/merge');
const path = require('path');
const packageJson = require('./package.json');
const NodeCache = require('node-cache');

module.exports = fp(async (fastify, options) => {
  const cache = new NodeCache();
  options = merge(
    {
      nls: {
        endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
        apiVersion: '2019-02-28'
      },
      prefix: `/api/v${packageJson.version.split('.')[0]}/aliyun`,
      createAuthenticate: () => {
        return [];
      }
    },
    options,
    { cache }
  );
  fastify.register(require('@kne/fastify-namespace'), {
    name: 'aliyun',
    options,
    modules: [['controllers', path.resolve(__dirname, './libs/controllers.js')]]
  });
});
