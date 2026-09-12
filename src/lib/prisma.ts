/**
 * The database client, loaded when a request needs it rather than when the module is imported.
 *
 * `next build` imports every route to collect its page data, so whatever a route runs at import
 * time runs during the build. A `new PrismaClient()` at module scope — or the import of
 * `@prisma/client` itself, which throws in any environment where the client has not been generated
 * — therefore failed the build rather than the request: "Failed to collect page data for
 * /api/sessions", the deployment stopped, and nothing in the message to say which line did it.
 *
 * Loaded here, a client that cannot start fails the one request that needed it, and both handlers
 * in that route already answer with their fallback when the database is unreachable.
 */
import type { PrismaClient } from '@prisma/client';

/**
 * Kept on the global in development, where every edit re-evaluates this module: a fresh client per
 * reload opens another pool of connections until the database stops accepting them.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

let client: PrismaClient | undefined;

export async function getPrisma(): Promise<PrismaClient> {
  if (client) return client;
  if (globalForPrisma.prisma) {
    client = globalForPrisma.prisma;
    return client;
  }

  const { PrismaClient: Client } = await import('@prisma/client');
  client = new Client({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;
  return client;
}
