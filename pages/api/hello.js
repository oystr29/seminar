// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { google } from 'googleapis';
function getMonth(month) {
  const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const monthNumber = bulan.indexOf(month) + 1;

  let value;

  if (monthNumber < 10) {
    value = "0" + monthNumber.toString();
  } else {
    value = monthNumber.toString();
  }
  return value;
}

function getDate(text) {
  const daysExp = /Senin|Selasa|Rabu|Kamis|Jum'at/ig
  const monthsExp = /Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember/ig
  const yearsExp = /\b(20)\d{2}\b/ig
  const tanggalExp = /([0-3][0-9])|([0-9])/ig

  const hari = text.match(daysExp) || [''];
  const tanggal = text.match(tanggalExp) || [''];
  const bulan = text.match(monthsExp) || [''];
  const tahun = text.match(yearsExp) || [''];

  return {
    hari: hari[0],
    tanggal: tanggal[0].length === 2 ? tanggal[0] : "0" + tanggal[0],
    bulan: getMonth(bulan[0]),
    bulanAsli: bulan[0],
    tahun: tahun[0]
  }
}

function getTime(text) {

  const regex = /\d{2}.\d{2}-\d{2}.\d{2}/g

  const result = text.match(regex);
  const replace = result[0].replace(/\./gi, ":");
  const splitter = replace.split("-");

  return {
    jamMulai: splitter[0],
    jamAkhir: splitter[1]
  }
}
const getData = async () => {
  const arrays = [];
  const currents = [];
  const notyet = [];
  const passed = [];
  const scheduled = [];

  // Auth
  const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'], credentials: credentials
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const range = `Sheet1!A6:I`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });
  const res = await sheets.spreadsheets.get({
    spreadsheetId: process.env.SHEET_ID,
    ranges: range,
    includeGridData: true,
    fields: "sheets(data(rowData(values(effectiveFormat.backgroundColor))))"
  });

  const resData = res.data.sheets[0].data[0].rowData;

  let index = 0;
  let currIndex = 0;
  const array = response.data.values;

  array.forEach((e, i) => {
    const property = {
      no: '',
      nama: '',
      nim: '',
      judul: '',
      sempro: false,
      semhas: false,
      pendadaran: false,
      jadwal: {
        tanggal: '',
        jam: '',
        ruang: ''
      },
      date: {
        day: {
          hari: '',
          tanggal: '',
          bulan: '',
          bulanAsli: '',
          tahun: ''
        },
        time: {
          jamMulai: '',
          jamAkhir: ''
        }
      },
      dateInt: {
        mulai: 0,
        akhir: 0,
      },
    }
    if (index === 0) {
      property.no = e[0];
      property.nama = e[1];
      property.nim = e[2];
      property.judul = e[3];
      property.sempro = resData[i].values[4].effectiveFormat.backgroundColor.blue === 1 && resData[i].values[4].effectiveFormat.backgroundColor.blue ? false : true;
      property.semhas = resData[i].values[5].effectiveFormat.backgroundColor.blue === 1 && resData[i].values[4].effectiveFormat.backgroundColor.blue ? false : true;
      property.pendadaran = resData[i].values[6].effectiveFormat.backgroundColor.blue === 1 && resData[i].values[4].effectiveFormat.backgroundColor.blue ? false : true;
      property.jadwal.tanggal = e[7];
      property.date.day = getDate(e[7]);
      arrays.push(property);
    } else if (index === 1) {
      if (e[7] !== undefined) {
        arrays[currIndex].jadwal.jam = e[7];
        arrays[currIndex].date.time = getTime(e[7]);

        // Masukkan Date
        const ar = arrays[currIndex];
        const ar2 = arrays[currIndex].date

        ar.dateInt.mulai = Date.parse(new Date(`${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamMulai}:00+0800`));
        ar.dateInt.akhir = Date.parse(new Date(`${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamAkhir}:00+0800`));
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
      else if (Date.now() >= arrays[currIndex].dateInt.mulai && Date.now() <= arrays[currIndex].dateInt.akhir) {
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

  // notyet.push(
  //   {
  //     no: '99',
  //     nama: 'Oktavian',
  //     nim: '1915016074',
  //     judul: 'Makan',
  //     sempro: true,
  //     semhas: false,
  //     pendadaran: false,
  //     jadwal: {
  //       tanggal: '',
  //       jam: '',
  //       ruang: ''
  //     },
  //     date: {
  //       day: {
  //         hari: '',
  //         tanggal: '',
  //         bulan: '',
  //         bulanAsli: '',
  //         tahun: ''
  //       },
  //       time: {
  //         jamMulai: '',
  //         jamAkhir: ''
  //       }
  //     },
  //     dateInt: {
  //       mulai: Date.now() + 10,
  //       akhir: Date.now() + 15,
  //     },
  //   }
  // );

  notyet.sort((a, b) => {
    return a.dateInt.mulai - b.dateInt.mulai;
  });

  return {
    currents,
    scheduled,
    notyet,
    passed,
  }
}
export default async function handler(req, res) {
  const { currents, scheduled, notyet, passed } = await getData();
  res.status(200).json({ currents: currents, scheduled: scheduled, notyet: notyet, passed: passed })
}
