import type { NextApiResponse } from 'next';
import type { JwtPayload } from 'types/jwt';
import type { WithUserApiRequest } from 'types/handler';
import jwt from 'jsonwebtoken';
import getConfig from 'next/config';
import { prisma } from 'lib/prisma';

const { serverRuntimeConfig } = getConfig();

const requireAuth = (
  fn: (req: WithUserApiRequest, res: NextApiResponse) => void,
) => {
  return async (request: WithUserApiRequest, response: NextApiResponse) => {
    let token =
      request.body.token ||
      request.query.token ||
      request.headers.authorization;

    if (!token)
      return response.status(401).json({
        success: false,
        message: 'Unauthorized 1: Please login to get access',
      });

    if (token.startsWith('Bearer ')) token = token.substring(7, token.length);

    try {
      const decoded = (await jwt.verify(
        token,
        serverRuntimeConfig.accessSecretKey,
      )) as JwtPayload;
      if (decoded) {
        const currentUser = await prisma.user.findUnique({
          where: {
            id: decoded.id,
          },
          select: {
            id: true,
            email: true,
            role: true,
          },
        });

        if (!currentUser) {
          return response.status(401).json({
            success: false,
            message: 'The user belonging to this token no longer exist.',
          });
        }

        request.user = currentUser;

        return await fn(request, response);
      }
    } catch (err) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized 2: Please login to get access',
      });
    }
  };
};

export default requireAuth;
