// 响应 schema 会参与 fast-json-stringify 序列化：对象一律 additionalProperties: true 以免裁掉未声明字段；
// 用 nullable 而非类型数组，类型不确定的字段（如 id、日期）只写说明不声明类型
const str = description => ({ type: 'string', nullable: true, description });
const num = description => ({ type: 'number', nullable: true, description });
const any = description => ({ description });

const success = (description, properties) => ({
  200: { type: 'object', additionalProperties: true, description, properties: properties || {} }
});

module.exports = { str, num, any, success };
