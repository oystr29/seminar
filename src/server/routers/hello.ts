import { google } from "googleapis";
import { z } from "zod";
import { procedure, router } from "~/server/trpc";

const slugIDSchema = z.union([z.string(), z.string().array(), z.undefined()]);

type SlugID = z.infer<typeof slugIDSchema>;

const seminarSchema = z.object({
  no: z.string(),
  nama: z.string(),
  nim: z.string(),
  judul: z.string(),
  sempro: z.boolean(),
  semhas: z.boolean(),
  pendadaran: z.boolean(),
  jadwal: z.object({
    tanggal: z.string(),
    jam: z.string(),
    ruang: z.string(),
  }),
  date: z.object({
    day: z.object({
      hari: z.string(),
      tanggal: z.string(),
      bulan: z.string(),
      bulanAsli: z.string(),
      tahun: z.string(),
    }),
    time: z.object({
      jamMulai: z.string().optional(),
      jamAkhir: z.string().optional(),
    }),
  }),
  dateInt: z.object({
    mulai: z.number(),
    akhir: z.number(),
  }),
});

const dataSemSchema = z.object({
  currents: z.array(seminarSchema),
  scheduled: z.array(seminarSchema),
  notyet: z.array(seminarSchema),
  passed: z.array(seminarSchema),
  sheetName: slugIDSchema,
});

// Type
export type Seminar = z.infer<typeof seminarSchema>;
export type DataSeminar = z.infer<typeof dataSemSchema>;

// Function
function getMonth(month: string) {
  const bulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const monthNumber = bulan.indexOf(month) + 1;

  let value;

  if (monthNumber < 10) {
    value = "0" + monthNumber.toString();
  } else {
    value = monthNumber.toString();
  }
  return value;
}

function splitterr(jam: string) {
  const a = jam.split(":");
  const numberA = parseInt(a[0]);
  if (numberA < 7) {
    const num = numberA + 12;
    return `${num}:${a[1]}`;
  }
  return jam;
}

function getDate(text: string) {
  const daysExp = /Senin|Selasa|Rabu|Kamis|Jum'at/gi;
  const monthsExp =
    /Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember/gi;
  const yearsExp = /\b(20)\d{2}\b/gi;
  const tanggalExp = /([0-3][0-9])|([0-9])/gi;

  const hari = text.match(daysExp) || [""];
  const tanggal = text.match(tanggalExp) || [""];
  const bulan = text.match(monthsExp) || [""];
  const tahun = text.match(yearsExp) || [""];

  return {
    hari: hari[0],
    tanggal: tanggal[0].length === 2 ? tanggal[0] : "0" + tanggal[0],
    bulan: getMonth(bulan[0]),
    bulanAsli: bulan[0],
    tahun: tahun[0],
  };
}

function getTime(text: string) {
  const regex = /\d{1,}.\d{1,}-\d{1,}.\d{1,}/g;

  const result = text.match(regex);
  const replace = result?.[0].replace(/\./gi, ":");
  const splitter = replace?.split("-");

  return {
    jamMulai: splitterr(`${splitter?.[0]}`),
    jamAkhir: splitterr(`${splitter?.[1]}`),
  };
}

// Variable to store

const getData = async (sheet: SlugID, search: SlugID = "") => {
  const arrays: Seminar[] = [];
  const currents: Seminar[] = [];
  const notyet: Seminar[] = [];
  const passed: Seminar[] = [];
  const scheduled: Seminar[] = [];

  // Auth
  const credentials = JSON.parse(
    `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
  );
  const cells = "!A6:I";
  let sheetName = sheet;
  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    credentials: credentials,
  });
  let range = "";

  const sheets = google.sheets({ version: "v4", auth });

  if (!sheet) {
    const resSheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SHEET_ID,
    });

    const lenSheets = resSheet.data.sheets?.length as number;
    sheetName = `${resSheet.data.sheets?.[lenSheets - 1].properties?.title}`;
    range = `${sheetName}${cells}`;
  } else {
    range = `${sheet}${cells}`;
  }

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.SHEET_ID,
    ranges: [range],
    includeGridData: true,
    fields: "sheets(data(rowData(values(effectiveFormat.backgroundColor))))",
  });

  const resData = res.data.sheets?.[0].data?.[0].rowData;

  let index = 0;
  let currIndex = 0;
  const array = response.data.values;

  array?.forEach((e, i) => {
    const property: Seminar = {
      no: "",
      nama: "",
      nim: "",
      judul: "",
      sempro: false,
      semhas: false,
      pendadaran: false,
      jadwal: {
        tanggal: "",
        jam: "",
        ruang: "",
      },
      date: {
        day: {
          hari: "",
          tanggal: "",
          bulan: "",
          bulanAsli: "",
          tahun: "",
        },
        time: {
          jamMulai: "",
          jamAkhir: "",
        },
      },
      dateInt: {
        mulai: 0,
        akhir: 0,
      },
    };

    if (index === 0 && e && e.length !== 0) {
      property.no = e[0];
      property.nama = e[1];
      property.nim = e[2];
      property.judul = e[3];
      property.sempro =
        resData?.[i].values?.[4].effectiveFormat?.backgroundColor?.blue === 1 &&
          resData?.[i].values?.[4].effectiveFormat?.backgroundColor?.blue
          ? false
          : true;
      property.semhas =
        resData?.[i].values?.[5].effectiveFormat?.backgroundColor?.blue === 1 &&
          resData?.[i].values?.[4].effectiveFormat?.backgroundColor?.blue
          ? false
          : true;
      property.pendadaran =
        resData?.[i].values?.[6].effectiveFormat?.backgroundColor?.blue === 1 &&
          resData?.[i].values?.[4].effectiveFormat?.backgroundColor?.blue
          ? false
          : true;
      property.jadwal.tanggal = e[7];
      property.date.day = getDate(e[7]);
      arrays.push(property);
    } else if (index === 1 && e.length !== 0) {
      if (e[7] !== undefined) {
        arrays[currIndex].jadwal.jam = e[7];
        arrays[currIndex].date.time = getTime(e[7]);

        // Masukkan Date
        const ar = arrays[currIndex];
        const ar2 = arrays[currIndex].date;

        ar.dateInt.mulai = Date.parse(
          `${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamMulai}:00+0800`
        );
        ar.dateInt.akhir = Date.parse(
          `${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamAkhir}:00+0800`
        );
      }
    } else if (index === 2 && e.length !== 0) {
      if (e[7] !== undefined) {
        arrays[currIndex].jadwal.ruang = e[7];
      }
    }

    if (index === 2 && arrays[currIndex]) {
      index = 0;
      if (arrays[currIndex].dateInt.mulai === 0) {
        scheduled.push(arrays[currIndex]);
      }
      // not yet
      else if (arrays[currIndex].dateInt.mulai >= Date.now()) {
        notyet.push(arrays[currIndex]);
      }
      // Current
      else if (
        Date.now() >= arrays[currIndex].dateInt.mulai &&
        Date.now() <= arrays[currIndex].dateInt.akhir
      ) {
        currents.push(arrays[currIndex]);
      }
      // Passed
      else if (arrays[currIndex].dateInt.akhir <= Date.now()) {
        passed.push(arrays[currIndex]);
      }
      currIndex++;
    } else if (index !== 2) {
      index++;
    }
  });

  notyet.sort((a, b) => {
    return a.dateInt.mulai - b.dateInt.mulai;
  });
  passed.sort((a, b) => {
    return a.dateInt.mulai - b.dateInt.mulai;
  });

  return {
    currents: currents.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase())
      )
    ),
    scheduled: scheduled.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase())
      )
    ),
    notyet: notyet.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase())
      )
    ),
    passed: passed.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase())
      )
    ),
    sheetName,
  };
};

const helloRouter = router({
  seminar: procedure
    .input(z.object({ sheet_name: slugIDSchema, search: slugIDSchema }))
    .query(async ({ input: { sheet_name, search } }) => {
      const data = await getData(sheet_name, search);
      return data;
    }),
  sheets: procedure.query(async () => {
    // Auth
    const credentials = JSON.parse(
      `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`
    );

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      credentials,
    });

    const sheets = google.sheets({ version: "v4", auth });

    const resSheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SHEET_ID,
      fields: "sheets(properties(title))",
    });

    return resSheet.data.sheets;
  }),
  defaultSheetName: procedure.query(() => {
    return process.env.NEXT_PUBLIC_SHEET_NAME;
  }),
});

export default helloRouter;
