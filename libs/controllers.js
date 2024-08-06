const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/nls/getToken`,
    {
      onRequest: options.createAuthenticate('nls:getToken')
    },
    async () => {
      if (options.cache.has('nls:token')) {
        const Token = options.cache.get('nls:token');
        return { token: Token.Id };
      }
      const RPCClient = require('@alicloud/pop-core').RPCClient;
      const client = new RPCClient({
        accessKeyId: options.nls.accessKeyId,
        accessKeySecret: options.nls.accessKeySecret,
        endpoint: options.nls.endpoint,
        apiVersion: options.nls.apiVersion
      });
      const { Token } = await client.request('CreateToken');
      options.cache.set('nls:token', Token, Token.expireTime * 1000 - Date.now());
      return { token: Token.Id };
    }
  );
});
