const fastify = require('fastify')({
    logger: true
});

const fastifyEnv = require('@fastify/env');
const path = require("path");

fastify.register(fastifyEnv, {
    dotenv: true, schema: {
        type: 'object', required: ['ACCESS_KEY_ID', 'ACCESS_KEY_SECRET',], properties: {
            ACCESS_KEY_ID: {type: 'string'}, ACCESS_KEY_SECRET: {type: 'string'}, APP_KEY: {type: 'string'},
        }
    }
});

fastify.register(require('@kne/fastify-sequelize'));
fastify.register(require('@kne/fastify-file-manager'), {
    root: path.resolve('./static')
});

fastify.register(require('fastify-plugin')(async (fastify) => {
    await fastify.sequelize.sync();
    fastify.register(require('../index'), {
        nls: {
            appKey: fastify.config.APP_KEY,
            token: {accessKeyId: fastify.config.ACCESS_KEY_ID, accessKeySecret: fastify.config.ACCESS_KEY_SECRET}
        }
    });
}));

fastify.register(require('@kne/fastify-response-data-format'));

fastify.listen({port: 3000}, (err, address) => {
    if (err) throw err;
    // Server is now listening on ${address}
});
