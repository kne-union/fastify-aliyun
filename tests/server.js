const fastify = require('fastify')({
    logger: true
});

const fastifyEnv = require('@fastify/env');

fastify.register(fastifyEnv, {
    dotenv: true, schema: {
        type: 'object', required: ['ACCESS_KEY_ID', 'ACCESS_KEY_SECRET',], properties: {
            ACCESS_KEY_ID: {type: 'string'}, ACCESS_KEY_SECRET: {type: 'string'}
        }
    }
});

fastify.register(require('fastify-plugin')(async (fastify) => {
    fastify.register(require('../index'), {
        nls: {
            accessKeyId: fastify.config.ACCESS_KEY_ID, accessKeySecret: fastify.config.ACCESS_KEY_SECRET
        }
    });
}));

fastify.register(require('@kne/fastify-response-data-format'));

fastify.listen({port: 3000}, (err, address) => {
    if (err) throw err;
    // Server is now listening on ${address}
});
