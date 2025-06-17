fastify-aliyun 是一个用于集成阿里云服务的 Fastify 插件，目前支持阿里云智能语音交互（NLS）和对象存储（OSS）服务。该插件提供了简单易用的API接口，帮助开发者快速集成阿里云服务到 Fastify 应用中。

### 功能特性

- **阿里云NLS服务集成**
  - 自动管理和缓存访问令牌
  - 支持文本转语音（TTS）功能
  - 使用LRU缓存优化性能

- **阿里云OSS服务集成**
  - 文件上传（支持文件和流）
  - 文件下载
  - 文件流获取
  - 文件链接生成

### 安装方法

```bash
npm install fastify-aliyun
```

### 配置说明

插件需要以下配置：

```javascript
fastify.register(require('fastify-aliyun'), {
  nls: {
    appKey: 'your-nls-app-key',
    token: {
      accessKeyId: 'your-access-key-id',
      accessKeySecret: 'your-access-key-secret'
    }
  },
  oss: {
    // OSS配置（可选）
    region: 'oss-region',
    accessKeyId: 'your-access-key-id',
    accessKeySecret: 'your-access-key-secret',
    bucket: 'your-bucket-name'
  }
});
```

### 依赖插件

使用本插件前，需要安装和配置以下Fastify插件：

- @fastify/env - 环境变量管理
- @kne/fastify-sequelize - 数据库操作
- @kne/fastify-file-manager - 文件管理
- @kne/fastify-response-data-format - 响应数据格式化

### 使用示例

```javascript
const fastify = require('fastify')({ logger: true });

// 配置环境变量
fastify.register(fastifyEnv, {
  dotenv: true,
  schema: {
    type: 'object',
    required: ['NLS_APP_KEY', 'NLS_ACCESS_KEY_ID', 'NLS_ACCESS_KEY_SECRET'],
    properties: {
      NLS_APP_KEY: { type: 'string' },
      NLS_ACCESS_KEY_ID: { type: 'string' },
      NLS_ACCESS_KEY_SECRET: { type: 'string' }
    }
  }
});

// 注册插件
fastify.register(require('fastify-plugin')(async (fastify) => {
  await fastify.sequelize.sync();
  fastify.register(require('fastify-aliyun'), {
    nls: {
      appKey: fastify.config.NLS_APP_KEY,
      token: {
        accessKeyId: fastify.config.NLS_ACCESS_KEY_ID,
        accessKeySecret: fastify.config.NLS_ACCESS_KEY_SECRET
      }
    }
  });
}));

// 启动服务器
fastify.listen({ port: 3000 }, (err, address) => {
  if (err) throw err;
  // Server is now listening on ${address}
});
```
