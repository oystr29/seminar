import { procedure, router } from "~/server/trpc";
import axios, { AxiosError } from "axios";
import { z } from "zod";

const alumniRouter = router({
  all: procedure
    .input(
      z.object({
        search: z.union([
          z.string(),
          z.string().array(),
          z.undefined(),
          z.null(),
        ]),
        length: z.number().min(1).max(100).nullish(),
        cursor: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const length = input.length ?? 10;
      const start = input.cursor ?? 0;
      const params = {
        draw: 2,
        columns: [
          {
            data: "id",
            name: "id",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "nim",
            name: "nim",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
          {
            data: "nama",
            name: "nama",
            searchable: true,
            orderable: true,
            search: {
              value: "",
              regex: false,
            },
          },
        ],
        order: [
          {
            column: 0,
            dir: "asc",
          },
        ],
        start,
        length,
        search: {
          value: input.search,
          regex: false,
        },
      };
      try {
        const res = await axios(
          `https://informatika.ft.unmul.ac.id/kemahasiswaan/list_alumni`,
          {
            params,
            headers: {
              Accept: "application/json, text/javascript, */*; q=0.01",
              "x-requested-with": "XMLHttpRequest",
            },
          },
        );
        const data = res.data as {
          recordsFiltered: number;
          recordsTotal: number;
          data: {
            id: number;
            nim: string;
            nama: string;
            testimoni: string;
            foto: string | null;
          }[];
          input: {
            start: string;
          };
        };
        return {
          ...data,
          data: data.data.map((d) => ({
            id: d.id,
            nama: d.nama,
            nim: d.nim,
            foto: d.foto,
            testimoni: d.testimoni,
          })),
        };
      } catch (e) {
        console.error(e);
        if (e instanceof AxiosError) throw new Error(e.message);

        throw new Error("Error Gan");
      }
    }),
});

export default alumniRouter;
