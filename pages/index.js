import Head from 'next/head'
import React from 'react';
import { google } from 'googleapis'
import Countdown from 'react-countdown'
import { useEffect, useState } from 'react';
import { HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker } from 'react-icons/hi';

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
  const tanggalExp = /^([0-9])|([0-3][0-9])/ig

  const hari = text.match(daysExp) || [''];
  const tanggal = text.match(tanggalExp) || [''];
  const bulan = text.match(monthsExp) || [''];
  const tahun = text.match(yearsExp) || [''];


  return {
    hari: hari[0],
    tanggal: tanggal[0],
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

export async function getStaticProps() {

  const arrays = [];
  const currents = [];
  const notyet = [];
  const passed = [];
  const scheduled = [];

  // Auth
  const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });

  const sheets = google.sheets({ version: 'v4', auth });

  const range = `DATA SEMINAR!A6:I`;

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range,
  });

  let index = 0;
  let currIndex = 0;
  const array = response.data.values;

  array.forEach((e) => {
    const property = {
      no: '',
      nama: '',
      nim: '',
      judul: '',
      sempro: '',
      semhas: '',
      pendadaran: '',
      jadwal: {
        tanggal: '',
        jam: '',
        ruang: ''
      },
      date: {
        day: '',
        time: ''
      },
      dateInt: {
        mulai: 0,
        akhir: 0,
      },
      hp: ''
    }
    if (index === 0) {
      property.no = e[0];
      property.nama = e[1];
      property.nim = e[2];
      property.judul = e[3];
      property.sempro = e[4];
      property.semhas = e[5];
      property.pendadaran = e[6];
      property.jadwal.tanggal = e[7];
      property.date.day = getDate(e[7]);
      property.hp = e[8];
      arrays.push(property);
    } else if (index === 1) {
      if (e[7] !== undefined) {
        arrays[currIndex].jadwal.jam = e[7];
        arrays[currIndex].date.time = getTime(e[7]);

        // Masukkan Date
        const ar = arrays[currIndex];
        const ar2 = arrays[currIndex].date

        ar.dateInt.mulai = Date.parse(new Date(`${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamMulai}:00Z`));
        ar.dateInt.akhir = Date.parse(new Date(`${ar2.day.tahun}-${ar2.day.bulan}-${ar2.day.tanggal}T${ar2.time.jamAkhir}:00Z`));
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

  // console.log(Date.now());
  // console.log(arrays[0].date.time);
  // console.log(arrays);

  return {
    props: {
      currents,
      scheduled,
      notyet,
      passed,
    }
  }
}

export default function Home({ currents, scheduled, notyet, passed }) {

  const [curr, setCurrent] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [coming, setComing] = useState([]);
  const [pass, setPass] = useState([]);

  useEffect(() => {
    setCurrent(currents);
    setSchedule(scheduled);
    setComing(notyet);
    setPass(passed);
  }, [currents, scheduled, notyet, passed]);


  return (
    <ErrorBoundary>
      <Head>
        <title>Seminar IF</title>
      </Head>
      <div className='container mx-auto mt-10'>

        {
          curr.map((e, i) => {
            return (
              <Item e={e} key={e.nim + i} classes="current" />
            );
          })
        }
        {
          coming.map((e, i) => {
            return (
              <Item e={e} key={e.nim + i} classes="notyet" />
            );
          }).reverse()
        }
        {schedule.map((e, i) => {
          return (
            <Item e={e} key={e.nim + i} classes="scheduled" />
          );
        })}
        {pass.map((e, i) => {
          return (
            <Item e={e} key={e.nim + i} classes="passed" />
          );
        }).reverse()}
      </div>
    </ErrorBoundary>
  );
}



const Item = (props) => {
  const { e, classes } = props;
  return (
    <div className={`items ${classes}`} >
      <div className={`font-bold text-xl`}>{e.judul}</div>
      <span className='uppercase font-semibold'>{e.nama} </span>
      <span> - </span>
      <span className='font-semibold'>{e.nim}</span>
      <div className='mb-5'>
        {e.date.day.hari !== '' &&
          <div className='flex items-center flex-row my-1'>
            <HiOutlineCalendar className=' mr-2' />
            <span>{e.date.day.hari}, {e.date.day.tanggal} - {e.date.day.bulanAsli} - {e.date.day.tahun}</span>
          </div>
        }
        {e.date.time !== '' &&
          <div className='flex flex-row items-center mb-1'>
            <HiOutlineClock className='mr-2' />
            <span>{e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA</span>
          </div>
        }
        {e.jadwal.ruang !== '' &&
          <div className='flex flex-row items-center '>
            <HiOutlineLocationMarker className='mr-2' />
            <span>{e.jadwal.ruang}</span>
          </div>
        }
      </div>
      {Date.now() <= e.dateInt.mulai &&
        <Countdown date={e.dateInt.mulai} className="font-semibold" />
      }
    </div>
  )
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}