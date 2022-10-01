import type { NextApiResponse } from 'next';
import type { WithUserApiRequest } from 'types/handler';
import requireAuth from 'middleware/requireAuth';
import requireRoles from 'middleware/requireRoles';
import { Roles, prisma } from 'lib/prisma';
import { Role } from '@prisma/client';
import { pagination, order, Query } from 'lib/filter';

export type filterType = Query & {
  search?: string;
};

const handler = async (
  request: WithUserApiRequest,
  response: NextApiResponse,
) => {
  const filter = request.query as unknown as filterType;

  const { take, skip } = pagination({
    page: parseInt(filter.page!),
    limit: parseInt(filter.limit!),
  });

  const { orderBy } = order(filter.sort!);

  try {
    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy,
      where: {
        role: Role.MEMBER,
        OR: [
          {
            email: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: filter.search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        name: true,
        email: true,
        // createdAt: true,
      },
    });
    return response.status(200).json({ success: true, data: users });
  } catch (e) {
    return response.status(500).json({
      success: false,
      message: 'Internal esrver error: Please refresh and try again!',
      error: e.message,
    });
  }
};

export default requireAuth(requireRoles(handler, [Roles.MEMBER]));
