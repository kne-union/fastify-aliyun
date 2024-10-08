const fp = require('fastify-plugin');
const { RPCClient } = require('@alicloud/pop-core');
const fetch = require('node-fetch');
const fileType = require('file-type');
const { parse } = require('ali-oss/shims/url');
module.exports = fp(async (fastify, options) => {
  const { services } = fastify.aliyun;
  const getToken = async () => {
    if (options.cache.has('nls:token')) {
      const Token = options.cache.get('nls:token');
      return { token: Token.Id, appKey: options.nls.appKey };
    }
    const client = new RPCClient({
      accessKeyId: options.nls.token.accessKeyId,
      accessKeySecret: options.nls.token.accessKeySecret,
      endpoint: options.nls.token.endpoint,
      apiVersion: options.nls.token.apiVersion
    });
    const { Token } = await client.request('CreateToken');
    options.cache.set('nls:token', Token, { ttl: parseInt(Token.ExpireTime * 1000 - Date.now()) - 1 });
    return { token: Token.Id, appKey: options.nls.appKey };
  };
  const tts = async ({ text, audioName }) => {
    const { token } = await getToken();
    const response = await fetch(options.nls.tts.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appkey: options.nls.appKey,
        text: text,
        token: token,
        format: 'wav'
      })
    });

    const buffer = await response.buffer();
    const type = await fileType.fromBuffer(buffer);
    if (!type) {
      const errorMsg = (() => {
        try {
          return JSON.parse(buffer.toString())?.message || '请求发生错误';
        } catch (e) {
          console.error(e);
          return '请求发生错误';
        }
      })();
      throw new Error(errorMsg);
    }
    return await fastify.fileManager.services.fileRecord.uploadToFileSystem({
      file: { toBuffer: () => buffer, filename: `${audioName || 'audio'}.${type.ext}`, mimetype: type.mime }
    });
  };
  services.nls = {
    getToken,
    tts
  };
});
