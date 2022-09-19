import { NextApiRequest, NextApiResponse } from 'next';
import { generateAccessToken } from '../../../lib/jwt';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';
import type { JwtPayload } from 'types/jwt';

const { serverRuntimeConfig } = getConfig();

export default async function handle(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET')
    return response.status(400).json({
      success: false,
      message: `The HTTP ${request.method} method is not supported by this route.`,
    });

  let token =
    request.body.token || request.query.token || request.headers.authorization;

  if (token.startsWith('Bearer ')) token = token.substring(7, token.length);

  if (!token)
    return response.status(401).json({
      success: false,
      message: 'Unauthorized: Please login to get access',
    });

  try {
    const decoded = (await jwt.verify(
      token,
      serverRuntimeConfig.accessSecretKey,
    )) as JwtPayload;
    if (decoded) {
      const accessToken = generateAccessToken(
        { id: decoded.id, email: decoded.email },
        { expiresIn: '1d' },
      );

      response.json({ accessToken });
    }
  } catch (err) {
    response
      .status(401)
      .json({ success: false, message: 'Unauthorized access.' });
  }
}
