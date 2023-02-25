import { sheets_v4 } from "googleapis";

export interface Seminar {
  no: string;
  nama: string;
  nim: string;
  judul: string;
  sempro: boolean;
  semhas: boolean;
  pendadaran: boolean;
  jadwal: {
    tanggal: string;
    jam: string;
    ruang: string;
  };
  date: {
    day: {
      hari: string;
      tanggal: string;
      bulan: string;
      bulanAsli: string;
      tahun: string;
    },
    time: {
      jamMulai: string;
      jamAkhir: string;
    }
  },
  dateInt: {
    mulai: number;
    akhir: number;
  }
}

export interface DataSem {
  currents: Seminar[];
  scheduled: Seminar[];
  notyet: Seminar[];
  passed: Seminar[];
  sheetName: string | null;
  sheets?: sheets_v4.Schema$Sheet[];
}

declare module '@rumess/react-flip-countdown' {

}