function getMonth(month: string): string {
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

  let value: string;

  if (monthNumber < 10) {
    value = "0" + monthNumber.toString();
  } else {
    value = monthNumber.toString();
  }
  return value;
}

export function getDate(text: string) {
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

function splitterr(jam: string) {
  const a = jam.split(":");
  const numberA = parseInt(a[0]);
  if (numberA < 7) {
    const num = numberA + 12;
    return `${num}:${a[1]}`;
  }
  return jam;
}

export function getTime(text: string) {
  const regex = /\d{1,}.\d{1,}-\d{1,}.\d{1,}/g;

  const result = text.match(regex);
  const replace = result?.[0].replace(/\./gi, ":");
  const splitter = replace?.split("-");

  return {
    jamMulai: splitterr(splitter![0]),
    jamAkhir: splitterr(splitter![1]),
  };
}