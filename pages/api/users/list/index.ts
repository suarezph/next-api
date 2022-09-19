import type { NextApiResponse } from 'next';
import type { WithUserApiRequest } from 'types/handler';
import requireAuth from 'middleware/requireAuth';
import requireRoles from 'middleware/requireRoles';
import { Roles } from 'lib/prisma';

const handler = async (
  request: WithUserApiRequest,
  response: NextApiResponse,
) => {
  const users = await prisma?.user.findMany({
    where: {
      id: { not: request.user.id },
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return response.status(200).json({ success: true, data: users });
};

export default requireAuth(requireRoles(handler, [Roles.ADMIN]));
