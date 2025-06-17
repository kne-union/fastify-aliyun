
# fastify-aliyun


### 描述

对接阿里云服务


### 安装

```shell
npm i --save @kne/fastify-aliyun
```


### 概述

### 项目简介

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


### 示例

#### 示例代码



### API

### API文档

本文档描述了fastify-aliyun插件提供的API接口。

### HTTP接口

#### NLS服务接口

| 接口路径 | 方法 | 说明 | 权限要求 |
|---------|-----|------|---------|
| /nls/getToken | GET | 获取NLS访问令牌 | 无 |
| /nls/tts | POST | 文本转语音 | 无 |

##### 获取NLS访问令牌

| 参数名 | 说明 | 类型 | 必填 | 默认值 |
|-------|-----|------|-----|-------|
| 无参数 | - | - | - | - |

**响应示例**：

```json
{
  "code": 0,
  "data": {
    "token": "xxxxxxxx",
    "expireTime": 1234567890
  }
}
```

##### 文本转语音

| 参数名 | 说明 | 类型 | 必填 | 默认值 |
|-------|-----|------|-----|-------|
| text | 要转换的文本内容 | string | 是 | - |
| format | 音频格式 | string | 否 | mp3 |
| voice | 发音人 | string | 否 | xiaoyun |
| volume | 音量 | number | 否 | 50 |
| speech_rate | 语速 | number | 否 | 0 |
| pitch_rate | 语调 | number | 否 | 0 |

**响应示例**：

```json
{
  "code": 0,
  "data": {
    "audio_file": "/path/to/audio/file.mp3"
  }
}
```

### 服务API

fastify-aliyun插件在Fastify实例上注册了`aliyun`命名空间，提供以下服务API：

#### NLS服务 (fastify.aliyun.nls)

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| getToken | 获取NLS访问令牌 | 无 | Promise<{token, expireTime}> |
| tts | 文本转语音 | options: {text, format, voice, volume, speech_rate, pitch_rate} | Promise<{audio_file}> |

#### OSS服务 (fastify.aliyun.oss)

| 方法名 | 说明 | 参数 | 返回值 |
|-------|------|------|-------|
| createClient | 创建OSS客户端 | options: {region, accessKeyId, accessKeySecret, bucket} | OSS客户端实例 |
| uploadFile | 上传文件 | filePath, objectName, options | Promise<{url, name}> |
| uploadFileStream | 上传文件流 | fileStream, objectName, options | Promise<{url, name}> |
| downloadFile | 下载文件 | objectName, localPath | Promise<void> |
| getFileStream | 获取文件流 | objectName | Promise<Readable> |
| getFileLink | 获取文件链接 | objectName, options | string |

### 使用示例

#### 获取NLS令牌

```javascript
fastify.get('/api/token', async (request, reply) => {
  const tokenData = await fastify.aliyun.nls.getToken();
  return { token: tokenData.token };
});
```

#### 文本转语音

```javascript
fastify.post('/api/speak', async (request, reply) => {
  const { text } = request.body;
  const result = await fastify.aliyun.nls.tts({
    text,
    format: 'mp3',
    voice: 'xiaoyun'
  });
  return { audioFile: result.audio_file };
});
```

#### 上传文件到OSS

```javascript
fastify.post('/api/upload', async (request, reply) => {
  const data = await request.file();
  const result = await fastify.aliyun.oss.uploadFileStream(
    data.file,
    `uploads/${data.filename}`,
    { contentType: data.mimetype }
  );
  return { url: result.url };
});
```

#### 获取OSS文件链接

```javascript
fastify.get('/api/files/:filename', async (request, reply) => {
  const { filename } = request.params;
  const url = fastify.aliyun.oss.getFileLink(`uploads/${filename}`);
  return { url };
});
```

