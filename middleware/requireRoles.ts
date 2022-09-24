import type { NextApiResponse } from 'next';
import type { WithUserApiRequest } from 'types/handler';

const requireRoles = (
  fn: (req: WithUserApiRequest, res: NextApiResponse) => void,
  roles: string[],
) => {
  return async (request: WithUserApiRequest, response: NextApiResponse) => {
    if (!roles.includes(request.user?.role)) {
      return response.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action.',
      });
    }

    return await fn(request, response);
  };
};

export default requireRoles;
