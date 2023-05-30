import { procedure, router } from "~/server/trpc";
import * as cheerio from "cheerio";

const docsRouter = router({
  pkl: procedure.query(async () => {
    const res = await fetch(
      "http://informatika.ft.unmul.ac.id/index.php/pages/post/Panduan.PKL#",
      { method: "GET" }
    );

    const data = await res.text();

    const $ = cheerio.load(data);

    console.log($('.post-item-description > a'))

  }),
});

export default docsRouter;
