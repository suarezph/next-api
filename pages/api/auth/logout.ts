import requireAuth from 'middleware/requireAuth';
import type { NextApiResponse } from 'next';
import type { WithUserApiRequest } from 'types/handler';
import jwt from 'jsonwebtoken';

const handle = (request: WithUserApiRequest, response: NextApiResponse) => {
  if (request.method !== 'GET')
    return response.status(400).json({
      success: false,
      message: `The HTTP ${request.method} method is not supported by this route.`,
    });

  let token =
    request.body.token || request.query.token || request.headers.authorization;

  if (!token)
    return response.status(401).json({
      success: false,
      message: 'Unauthorized: Please login to get access',
    });

  if (token.startsWith('Bearer ')) token = token.substring(7, token.length);

  jwt.sign(token, '', { expiresIn: '2s' }, logout => {
    if (!logout) {
      return response.status(401).json({
        success: false,
        message: 'There is a problem with the logout. Please try again.',
      });
    }
    return response.json({
      success: true,
      message: 'You have been logged out',
    });
  });

  // const expiredToken = jwt.sign(token, '', { expiresIn: 1 });

  // if (!expiredToken) {
  //   return response.status(401).json({
  //     success: false,
  //     message: 'There is a problem with the logout. Please try again.',
  //   });
  // }

  // return response.json({ success: true, message: 'You have been logged out' });
};

export default requireAuth(handle);
