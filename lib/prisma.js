import { PrismaClient } from '@prisma/client';

const prisma = (() => {
  let client;

  if (process.env.NODE_ENV === 'production') {
    client = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }

    client = global.prisma;
  }

  return client;
})();

export default prisma;
