// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { NextApiRequest, NextApiResponse } from 'next';

import { google } from "googleapis";
import { Seminar } from '../..';
import { getDate, getTime } from '../lib/utils';

const getData = async () => {
  const arrays: Seminar[] = [];
  const currents: Seminar[] = [];
  const notyet: Seminar[] = [];
  const passed: Seminar[] = [];
  const scheduled: Seminar[] = [];

  // Auth
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  try {
    const auth = await google.auth.getClient({
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
      credentials: credentials,
    });

    const sheets = google.sheets({ version: "v4", auth });

    const range = `JAN-MAR 23!A6:I`;

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

    const resData = res.data.sheets[0].data[0].rowData;

    let index = 0;
    let currIndex = 0;
    const array = response.data.values;

    array.forEach((e, i) => {
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
      if (index === 0) {
        property.no = e[0];
        property.nama = e[1];
        property.nim = e[2];
        property.judul = e[3];
        property.sempro =
          resData[i].values[4].effectiveFormat.backgroundColor.blue === 1 &&
            resData[i].values[4].effectiveFormat.backgroundColor.blue
            ? false
            : true;
        property.semhas =
          resData[i].values[5].effectiveFormat.backgroundColor.blue === 1 &&
            resData[i].values[4].effectiveFormat.backgroundColor.blue
            ? false
            : true;
        property.pendadaran =
          resData[i].values[6].effectiveFormat.backgroundColor.blue === 1 &&
            resData[i].values[4].effectiveFormat.backgroundColor.blue
            ? false
            : true;
        property.jadwal.tanggal = e[7];
        property.date.day = getDate(e[7]);
        arrays.push(property);
      } else if (index === 1) {
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
      } else if (index === 2) {
        if (e[7] !== undefined) {
          arrays[currIndex].jadwal.ruang = e[7];
        }
      }

      if (index === 2) {
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
    const t = new Date();

    notyet.push(
      {
        no: '99',
        nama: 'Oktavian',
        nim: '1915016074',
        judul: 'Makan',
        sempro: true,
        semhas: false,
        pendadaran: false,
        jadwal: {
          tanggal: 'Hari/Tgl : Senin, 27 Februari 2023',
          jam: 'Pukul     : 10.00-12.00 wita',
          ruang: 'Ruang   : Gedung Lab Lantai 2 D211'
        },
        date: {
          day: {
            hari: 'Senin',
            tanggal: '27',
            bulan: '02',
            bulanAsli: 'Februari',
            tahun: '2023'
          },
          time: {
            jamMulai: '10:00',
            jamAkhir: '12:00'
          }
        },
        dateInt: {
          mulai: t.setSeconds(t.getSeconds() + 10),
          akhir: t.setSeconds(t.getSeconds() + 15),
        },
      }
    );

    notyet.sort((a, b) => {
      return a.dateInt.mulai - b.dateInt.mulai;
    });
    passed.sort((a, b) => {
      return a.dateInt.mulai - b.dateInt.mulai;
    });

    return {
      currents,
      scheduled,
      notyet,
      passed,
    };
  } catch (error) {
    console.log(error);
  }
};
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { currents, scheduled, notyet, passed } = await getData();
  res.status(200).json({
    currents,
    scheduled,
    notyet,
    passed,
  });
}
