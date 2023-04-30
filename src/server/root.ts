import helloRouter from "~/server/routers/hello";
import { router } from "~/server/trpc";

export const appRouter = router({
  hello: helloRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
