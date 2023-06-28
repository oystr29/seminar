import helloRouter from "~/server/routers/hello";
import docsRouter from "~/server/routers/docs";
import { router } from "~/server/trpc";

export const appRouter = router({
  hello: helloRouter,
  docs: docsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
