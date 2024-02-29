import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";
import { TRPCError } from "@trpc/server";
import { Prisma } from "@prisma/client";

// Create a new ratelimiter, that allows 3 requests per 1 minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
});

export const googleRouter = createTRPCRouter({
  locationSearch: protectedProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const queryInput = input.query.toLowerCase();
      const userSession = ctx.session.user;

      const searchCache = await ctx.prisma.placeTextSearch.findFirst({
        where: {
          query: queryInput,
        },
      });

      if (searchCache !== null) return searchCache.result;

      const { success } = await ratelimit.limit(userSession.id);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const queryParams = {
        language: "th",
        region: "th",
        key: process.env.GOOGLE_MAP_KEY,
        query: queryInput,
      };
      // Convert the query parameters object into a query string
      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
        .join("&");

      // Define the API endpoint with the query parameters
      const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?${queryString}`;

      let result = await fetch(apiUrl);

      let json = await result.json();

      if (json.status === "OK") {
        const post = await ctx.prisma.placeTextSearch.create({
          data: {
            query: input.query,
            result: json !== null ? json.results : Prisma.JsonNull,
          },
        });
        return post.result;
      } else {
        return null;
      }
    }),

  getDirection: protectedProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ ctx, input }) => {
      const queryInput = input.query.toLowerCase();
      const userSession = ctx.session.user;

      const searchCache = await ctx.prisma.placeTextSearch.findFirst({
        where: {
          query: queryInput,
        },
      });

      if (searchCache !== null) return searchCache.result;

      const { success } = await ratelimit.limit(userSession.id);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const queryParams = {
        language: "th",
        region: "th",
        key: process.env.GOOGLE_MAP_KEY,
        query: queryInput,
      };
      // Convert the query parameters object into a query string
      const queryString = Object.keys(queryParams)
        .map((key) => `${key}=${encodeURIComponent(queryParams[key])}`)
        .join("&");

      // Define the API endpoint with the query parameters
      const apiUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?${queryString}`;

      let result = await fetch(apiUrl);

      let json = await result.json();

      if (json.status === "OK") {
        const post = await ctx.prisma.placeTextSearch.create({
          data: {
            query: input.query,
            result: json !== null ? json.results : Prisma.JsonNull,
          },
        });
        return post.result;
      } else {
        return null;
      }
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "Welcome on board!";
  }),
});
