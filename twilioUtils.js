exports.parsePayload = (event) =>{
  const { body, isBase64Encoded } = event;
  const payload = isBase64Encoded ? Buffer.from(body, 'base64').toString() : body;
  const parsedPayload = new URLSearchParams(payload);
  return parsedPayload;
}