import { google } from "googleapis";
import { z } from "zod";
import { procedure, router } from "~/server/trpc";
import "dayjs/locale/id";
import dayjs from "dayjs";

const slugIDSchema = z.union([
  z.string(),
  z.string().array(),
  z.undefined(),
  z.null(),
]);

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
  const daysExp = /Senin|Selasa|Rabu|Kamis|Jum'at|Jumat|Sabtu|Minggu/gi;
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
//
const useNimble = ({
  title,
  name,
  sempro,
  semhas,
}: {
  title: string;
  name: string;
  sempro: boolean;
  semhas: boolean;
}) => {
  if (sempro) {
    return {
      title: `${title} 😄`,
      name: name.split(" ")[0],
    };
  }

  if (semhas) {
    return {
      title: `${title} 😁`,
      name: name.split(" ")[1],
    };
  }

  return {
    title: `${title} 😆`,
    name,
  };
};

const getData = async (sheet: SlugID, search: SlugID = "") => {
  const arrays: Seminar[] = [];
  const currents: Seminar[] = [];
  const notyet: Seminar[] = [];
  const passed: Seminar[] = [];
  const scheduled: Seminar[] = [];

  // Auth
  const credentials = JSON.parse(
    `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
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
  const array = response.data.values as string[][] | null | undefined;

  array?.forEach((e, i) => {
    const [no, nama, nim, judul, , , , jadwalLokasi] = e;
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

    const isNimble = `${process.env.NEXT_PUBLIC_NIMBLE}` === `${nim}`;

    if (index === 0 && e && e.length !== 0) {
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
      const { title, name } = useNimble({
        title: judul,
        name: nama,
        sempro: property.sempro,
        semhas: property.semhas,
      });
      property.no = no;
      property.nama = isNimble ? name : nama;
      property.nim = nim;
      property.judul = isNimble ? title : judul;

      property.pendadaran =
        resData?.[i].values?.[6].effectiveFormat?.backgroundColor?.blue === 1 &&
        resData?.[i].values?.[4].effectiveFormat?.backgroundColor?.blue
          ? false
          : true;
      property.jadwal.tanggal = jadwalLokasi;
      property.date.day = jadwalLokasi
        ? getDate(jadwalLokasi)
        : { hari: "", tanggal: "", bulan: "", tahun: "", bulanAsli: "" };
      arrays.push(property);
    } else if (index === 1 && e.length !== 0) {
      if (jadwalLokasi !== undefined) {
        const newTime = "Pukul     : 14.30-16.30 wita";
        arrays[currIndex].jadwal.jam =
          process.env.NEXT_PUBLIC_NIMBLE === arrays[currIndex].nim &&
          arrays[currIndex].semhas
            ? newTime
            : jadwalLokasi;
        arrays[currIndex].date.time = getTime(
          process.env.NEXT_PUBLIC_NIMBLE === arrays[currIndex].nim &&
            arrays[currIndex].semhas
            ? newTime
            : jadwalLokasi,
        );

        // Masukkan Date
        const ar = arrays[currIndex];
        const ar2 = arrays[currIndex].date;

        ar.dateInt.mulai = Date.parse(
          `${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamMulai}:00+0800`,
        );
        ar.dateInt.akhir = Date.parse(
          `${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamAkhir}:00+0800`,
        );
      }
    } else if (index === 2 && e.length !== 0) {
      if (jadwalLokasi !== "") {
        const ruang = jadwalLokasi as string;
        const ruangArr = ruang.split(":");
        arrays[currIndex].jadwal.ruang =
          ruangArr[ruangArr.length - 1].normalize();
      }
    }

    // Kalau List Terakhir gak punya jadwal
    if (array.length - 1 === i) {
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

      return;
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
          val.toLowerCase().includes((search as string).toLowerCase()),
      ),
    ),
    scheduled: scheduled.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase()),
      ),
    ),
    notyet: notyet.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase()),
      ),
    ),
    passed: passed.filter((entry) =>
      Object.values(entry).some(
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes((search as string).toLowerCase()),
      ),
    ),
    sheetName,
  };
};

const monthsSheet = [
  {
    names: ["jan", "januari", "january"],
    number: 1,
  },
  {
    names: ["feb", "februari", "february"],
    number: 2,
  },
  {
    names: ["mar", "maret", "march"],
    number: 3,
  },
  {
    names: ["apr", "april"],
    number: 4,
  },
  {
    names: ["mei", "may"],
    number: 5,
  },
  {
    names: ["jun", "juni", "june"],
    number: 6,
  },
  {
    names: ["jul", "juli", "july"],
    number: 7,
  },
  {
    names: ["agt", "agu", "agustus", "august"],
    number: 8,
  },
  {
    names: ["sep", "september"],
    number: 9,
  },
  {
    names: ["okt", "oktober", "october"],
    number: 10,
  },
  {
    names: ["nov", "november"],
    number: 11,
  },
  {
    names: ["des", "desember"],
    number: 12,
  },
];

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
      `${process.env.GOOGLE_APPLICATION_CREDENTIALS}`,
    );

    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      credentials,
    });

    const sheets = google.sheets({ version: "v4", auth });

    const resSheet = await sheets.spreadsheets.get({
      spreadsheetId: process.env.SHEET_ID,
      fields: "sheets(properties(title,index))",
    });

    const currMonthIndex = dayjs().locale("id").month();
    const currYear = dayjs().format("YY");
    let currSheet: string | undefined | null = "";
    const newSheets = resSheet.data.sheets?.sort((a, b) => {
      // split months and year
      const arrFirst = a.properties?.title?.split(" ");
      const arrSecond = b.properties?.title?.split(" ");

      // get year from array
      const yearA = (a.properties?.title?.match(/([0-9])\d+/g) ?? ["0"])[0];
      const yearB = (b.properties?.title?.match(/([0-9])\d+/g) ?? ["0"])[0];

      // split again the month
      /* const [monthAFrom, monthATo] = (arrFirst ?? ["-"])[0].split("-");
      const [monthBFrom, monthBTo] = (arrSecond ?? ["-"])[0].split("-"); */
      const [monthAFrom, monthATo] = a.properties?.title?.match(
        /([A-Z])\w+/g,
      ) ?? ["", ""];
      const [monthBFrom, monthBTo] = b.properties?.title?.match(
        /([A-Z])\w+/g,
      ) ?? ["", ""];

      /* const firstMonth = (a.properties?.title?.match(/([A-Z])\w+/g) ?? [""])[0];
      const secondMonth = (b.properties?.title?.match(/([A-Z])\w+/g) ?? [
        "",
      ])[0];

      const firstYear = (a.properties?.title?.match(/([0-9])\d+/g) ?? ["0"])[0];
      const secondYear = (b.properties?.title?.match(/([0-9])\d+/g) ?? [
        "0",
      ])[0]; */

      const monthAFromIndex = monthsSheet.findIndex((e) =>
        e.names.includes(monthAFrom.toLowerCase()),
      );
      const monthBFromIndex = monthsSheet.findIndex((e) =>
        e.names.includes(monthBFrom.toLowerCase()),
      );

      const monthAToIndex = monthsSheet.findIndex((e) =>
        e.names.includes(monthATo.toLowerCase()),
      );
      const monthBToIndex = monthsSheet.findIndex((e) =>
        e.names.includes(monthBTo.toLowerCase()),
      );

      /* console.log(`a: ${a.properties?.title}, b: ${b.properties?.title}`);
      console.log(`monthAFromIndex: ${monthAFromIndex}`);
      console.log(`monthAToIndex: ${monthAToIndex}`);
      console.log(`monthBFromIndex: ${monthBFromIndex}`);
      console.log(`monthBToIndex: ${monthBToIndex}`);
      console.log(`yearA: ${yearA}`);
      console.log(`yearB: ${yearB}`);
      console.log(`currMonthIndex: ${currMonthIndex}`);
      console.log(`currYear: ${currYear}`);

      console.log("---------------------"); */

      if (
        (monthAFromIndex === currMonthIndex ||
          monthAToIndex === currMonthIndex) &&
        currYear === yearA
      ) {
        currSheet = a.properties?.title;
      }
      if (
        (monthBFromIndex === currMonthIndex ||
          monthBToIndex === currMonthIndex) &&
        currYear === yearB
      ) {
        currSheet = b.properties?.title;
      }

      if (Number(yearA) > Number(yearB)) {
        return monthAFromIndex + Number(yearA) - monthBFromIndex;
      }

      if (Number(yearA) < Number(yearB)) {
        return monthAFromIndex - (monthBFromIndex + Number(yearB));
      }

      return monthAFromIndex - monthBFromIndex;
    });

    return {
      data: newSheets?.reverse(),
      currSheet,
    };
  }),
});

export default helloRouter;
