import helloRouter from "~/server/routers/hello";
import docsRouter from "~/server/routers/docs";
import { router } from "~/server/trpc";
import alumniRouter from "~/server/routers/alumni";

export const appRouter = router({
  hello: helloRouter,
  docs: docsRouter,
  alumni: alumniRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
