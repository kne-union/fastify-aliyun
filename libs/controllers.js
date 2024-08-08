const fp = require('fastify-plugin');
module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/nls/getToken`,
    {
      onRequest: options.createAuthenticate('nls:getToken')
    },
    async () => {
      const { services } = fastify.aliyun;
      return services.nls.getToken();
    }
  );

  fastify.post(
    `${options.prefix}/nls/tts`,
    {
      onRequest: options.createAuthenticate('nls:tts'),
      schema: {
        body: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string' },
            audioName: { type: 'string' }
          }
        }
      }
    },
    async request => {
      const { services } = fastify.aliyun;
      return await services.nls.tts(request.body);
    }
  );
});
