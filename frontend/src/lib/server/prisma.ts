import { PrismaClient } from '@prisma/client';

const primsa = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
	global.prisma = primsa;
}

export { prisma };
