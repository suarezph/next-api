import { PrismaClient, Role } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export const Roles = Role;

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['warn', 'error', 'query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;
