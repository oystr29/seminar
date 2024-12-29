import { procedure, router } from "~/server/trpc";
import { google } from "googleapis";
import { z } from "zod";

const docsSchema = z.object({
  text: z.string(),
  href: z.string(),
});

export type Docs = z.infer<typeof docsSchema>;

const drive_id_base = "1odU5XG7fKW_Cwfu0Z12VSsEV9jYLPqeE";
const docsRouter = router({
  berkas: procedure
    .input(
      z.object({
        dir_id: z.union([
          z.string(),
          z.string().array(),
          z.undefined(),
          z.null(),
        ]),
        search: z.union([
          z.string(),
          z.string().array(),
          z.undefined(),
          z.null(),
        ]),
      }),
    )
    .query(async ({ input: { dir_id, search } }) => {
      // Auth
      const credentials = JSON.parse(
        `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
      );
      const auth = await google.auth.getClient({
        scopes: ["https://www.googleapis.com/auth/drive"],
        credentials: credentials,
      });

      const drive = google.drive({ auth, version: "v3" });
      // console.log(drive);

      if (!drive) {
        console.log("Kosong");
        throw Error("Drive tidak ditemukan");
      }
      const res = await drive.files.list({
        q: `'${dir_id ?? drive_id_base}' in parents and mimeType!='application/vnd.google-apps.folder' and name contains '${search}'`,
        fields:
          "nextPageToken, files(id, name, imageMediaMetadata, webViewLink, mimeType, thumbnailLink, iconLink, modifiedTime)",
      });

      return res.data.files;
    }),
  folder: procedure.query(async () => {
    // Auth
    const credentials = JSON.parse(
      `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    );
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/drive"],
      credentials: credentials,
    });

    const drive = google.drive({ auth, version: "v3" });
    // console.log(drive);

    if (!drive) {
      console.log("Kosong");
      throw Error("Drive tidak ditemukan");
    }

    const res = await drive.files.list({
      q: `'1odU5XG7fKW_Cwfu0Z12VSsEV9jYLPqeE' in parents and mimeType='application/vnd.google-apps.folder'`,
      fields:
        "nextPageToken, files(id, name, imageMediaMetadata, webViewLink, mimeType, thumbnailLink)",
    });

    if (res.data.files)
      return [...res.data.files, { id: drive_id_base, name: "Lainnya" }];
    return undefined;
  }),
});

export default docsRouter;
