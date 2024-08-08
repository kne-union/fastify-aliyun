const OSS = require('ali-oss');
const fp = require('fastify-plugin');

module.exports = fp(async (fastify, options) => {
  const { services } = fastify.aliyun;
  const client = new OSS({
    region: options.oss.region,
    accessKeyId: options.oss.accessKeyId,
    accessKeySecret: options.oss.accessKeySecret,
    bucket: options.oss.bucket
  });

  const uploadFile = async ({ file, filename }) => {
    await client.put(`${options.oss.baseDir}/${filename}`, file);
  };

  const uploadFileStream = async ({ stream, filename }) => {
    await client.putStream(`${options.oss.baseDir}/${filename}`, stream);
  };

  const downloadFile = async ({ filename }) => {
    const result = await client.get(`${options.oss.baseDir}/${filename}`);
    return result.content;
  };

  const getFileLink = ({ filename, expires }) => {
    return client.signatureUrl(`${options.oss.baseDir}/${filename}`, { expires: expires || 3600 });
  };

  services.oss = {
    client,
    uploadFile,
    uploadFileStream,
    getFileLink,
    downloadFile
  };
});
