import jwt from 'jsonwebtoken';
import getConfig from 'next/config';

const { serverRuntimeConfig } = getConfig();

export function generateAccessToken(
  { id, email }: { id: string; email: string },
  options = {},
) {
  console.log('accesstoken_', serverRuntimeConfig.accessSecretKey);
  return jwt.sign(
    { id: id, email: email },
    serverRuntimeConfig.accessSecretKey,
    options,
  );
}

export function generateRefreshToken(
  { id, email }: { id: string; email: string },
  options = {},
) {
  console.log('accesstoken_', serverRuntimeConfig.refreshSecretKey);
  return jwt.sign(
    { id: id, email: email },
    serverRuntimeConfig.refreshSecretKey,
    options,
  );
}

export default serverRuntimeConfig;
