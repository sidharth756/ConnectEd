const { PrismaClient } = require('@prisma/client');

// PrismaClient singleton instance
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Checks database connectivity status safely without crashing server
 * @returns {Promise<boolean>}
 */
async function checkDbConnection() {
  if (!process.env.DATABASE_URL) {
    return false;
  }
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  prisma,
  checkDbConnection,
};
