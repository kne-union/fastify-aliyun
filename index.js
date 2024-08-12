const fp = require('fastify-plugin');
const merge = require('lodash/merge');
const path = require('path');
const packageJson = require('./package.json');
const { LRUCache } = require('lru-cache');

module.exports = fp(
  async (fastify, options) => {
    const cache = new LRUCache({ max: 1000 });
    options = merge(
      {
        nls: {
          token: {
            endpoint: 'http://nls-meta.cn-shanghai.aliyuncs.com',
            apiVersion: '2019-02-28'
          },
          tts: {
            endpoint: 'http://nls-gateway-cn-shanghai.aliyuncs.com/stream/v1/tts'
          }
        },
        oss: {
          baseDir: 'default'
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
      modules: [
        ['controllers', path.resolve(__dirname, './libs/controllers.js')],
        ['services', path.resolve(__dirname, './libs/services')]
      ]
    });
  },
  {
    name: 'fastify-aliyun',
    dependencies: ['fastify-file-manager']
  }
);
