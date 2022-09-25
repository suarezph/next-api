import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { generateAccessToken, generateRefreshToken } from 'lib/jwt';
import { verifyPassword } from 'lib/auth';
// import cookie from 'cookie';

// @TODO:
// When logged-In, make the current one expired
// Token should save to DB
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST')
    return response.status(422).json({
      success: false,
      message: `The HTTP ${request.method} method is not supported by this route.`,
    });

  let user;
  const { email, password } = request.body;

  try {
    user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  } catch (e) {
    return response.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later',
      log: e,
    });
  }

  if (!user || !user.password) {
    return response.status(422).json({
      success: false,
      message: 'Credentials are invalid. Please try again.',
    });
  }

  const isValid = await verifyPassword(password, user.password);

  if (!isValid) {
    return response.status(422).json({
      success: false,
      message: 'Credentials are invalid. Please try again.',
    });
  }

  const accessToken = await generateAccessToken(
    { id: user.id, email: user.email! },
    {
      expiresIn: '1d',
    },
  );

  const refreshToken = await generateRefreshToken(
    { id: user.id, email: user.email! },
    {
      expiresIn: '5d',
    },
  );

  // Assigning refresh token in http-only cookie
  // disabled function considering mobile devices has no cookies
  // response.setHeader(
  //   'Set-Cookie',
  //   cookie.serialize('rtoken', refreshToken, {
  //     httpOnly: true,
  //     secure: process.env.NODE_ENV !== 'development',
  //     sameSite: 'strict',
  //     maxAge: 60 * 60,
  //     path: '/',
  //   }),
  // );

  return response.json({
    success: true,
    accessToken,
    refreshToken,
  });
}
