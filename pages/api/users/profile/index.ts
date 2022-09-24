import type { NextApiResponse } from 'next';
import type { WithUserApiRequest } from 'types/handler';
import requireAuth from 'middleware/requireAuth';
import requireRoles from 'middleware/requireRoles';
import { Roles } from 'lib/prisma';

const handler = async (
  request: WithUserApiRequest,
  response: NextApiResponse,
) => {
  const user = await prisma?.user.findFirst({
    where: {
      id: request.user.id,
    },
    select: {
      id: true,
      email: true,
      name: true,
      photo: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return response.status(200).json({ success: true, data: user });
};

export default requireAuth(requireRoles(handler, [Roles.ADMIN, Roles.MEMBER]));
