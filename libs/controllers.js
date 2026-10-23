const fp = require('fastify-plugin');
const { str, num, any, success } = require('./schema/response');

const TAG = '阿里云-智能语音';

module.exports = fp(async (fastify, options) => {
  fastify.post(
    `${options.prefix}/nls/getToken`,
    {
      onRequest: options.createAuthenticate('nls:getToken'),
      schema: {
        tags: [TAG],
        summary: '获取智能语音访问令牌',
        description: '用配置的 AccessKey 调用阿里云 CreateToken 获取 NLS 令牌，令牌在过期前缓存复用；供前端直连阿里云语音服务',
        response: success('NLS 令牌', {
          token: str('NLS 访问令牌'),
          appKey: str('配置的 NLS 项目 appKey')
        })
      }
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
        tags: [TAG],
        summary: '语音合成',
        description: '调用阿里云语音合成把文本转为 wav 音频，并通过 fastify-file-manager 保存为文件记录；合成失败时返回阿里云的错误信息',
        body: {
          type: 'object',
          required: ['text'],
          properties: {
            text: { type: 'string', description: '要合成的文本' },
            audioName: { type: 'string', description: '保存的音频文件名（不含扩展名），默认 audio' }
          }
        },
        response: success('保存的音频文件记录（fastify-file-manager 的 uploadToFileSystem 返回值）', {
          id: any('文件 ID（即文件记录的 uuid），用于下载或获取文件地址'),
          filename: str('文件名，如 audio.wav'),
          hash: str('文件内容 md5'),
          namespace: str('文件命名空间'),
          size: num('文件大小（字节）'),
          encoding: str('编码'),
          mimetype: str('MIME 类型'),
          storageType: str('存储类型：local 本地文件系统，oss 远程 OSS'),
          createdAt: any('创建时间'),
          updatedAt: any('更新时间')
        })
      }
    },
    async request => {
      const { services } = fastify.aliyun;
      return await services.nls.tts(request.body);
    }
  );
});
