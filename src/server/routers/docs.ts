import { procedure, router } from "~/server/trpc";
import * as cheerio from "cheerio";
import { z } from "zod";

const docsSchema = z.object({
  text: z.string(),
  href: z.string(),
});

export type Docs = z.infer<typeof docsSchema>;

const docsRouter = router({
  pkl: procedure.query(async () => {
    const res = await fetch(
      "http://informatika.ft.unmul.ac.id/index.php/pages/post/Panduan.PKL",
      { method: "GET" }
    );

    const data = await res.text();

    const $ = cheerio.load(data);

    const $aArray = $(".post-item-description a");

    const docs: Docs[] = $aArray.get().map((el, i) => {
      return {
        text: `${$(el).prop("innerHTML")}`,
        href: `${$(el).attr("href")?.replace(" \t", "").replace(/\s+/g, "")}`,
      };
    });

    return docs;
  }),
  skripsi: procedure.query(async () => {
    const res = await fetch(
      "http://informatika.ft.unmul.ac.id/index.php/pages/post/Panduan.Skripsi",
      { method: "GET" }
    );

    const data = await res.text();

    const $ = cheerio.load(data);

    const $aArray = $(".post-item-description a");

    const docs: Docs[] = $aArray.get().map((el, i) => {
      return {
        text: `${$(el).prop("innerHTML")}`,
        href: `${$(el).attr("href")?.replace(" \t", "").replace(/\s+/g, "")}`,
      };
    });

    return docs;
  }),
  keterangan: procedure.query(async () => {
    const res = await fetch(
      "http://informatika.ft.unmul.ac.id/index.php/pages/post/Surat.Keterangan",
      { method: "GET" }
    );

    const data = await res.text();

    const $ = cheerio.load(data);

    const $aArray = $(".post-item-description a");

    const docs: Docs[] = $aArray.get().map((el, i) => {
      return {
        text: `${$(el).prop("innerHTML")}`,
        href: `${$(el).attr("href")?.replace(" \t", "").replace(/\s+/g, "")}`,
      };
    });

    return docs;
  }),
});

export default docsRouter;
