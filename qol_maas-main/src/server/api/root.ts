import { exampleRouter } from "~/server/api/routers/example";
import { googleRouter } from "~/server/api/routers/google";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  google: googleRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
