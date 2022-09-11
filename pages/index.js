import Countdown, { CountdownApi } from "react-countdown";
import { useEffect, useState } from "react";
import {
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiDocument,
  HiPresentationChartLine,
} from "react-icons/hi";
import { MdSchool } from "react-icons/md";

export async function getServerSideProps() {
  const base =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://seminar.dalamkotak.com";
  const data = await fetch(`${base}/api/hello`);
  const { currents, scheduled, notyet, passed } = await data.json();

  return {
    props: {
      currents,
      scheduled,
      notyet,
      passed,
    },
  };
}

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Home(props) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstall, setIsInstall] = useState(true);

  function listenUserAction() {
    setIsInstall(true);
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    deferredPrompt.userChoice.then((choiceResult) => {
      setDeferredPrompt(null);
    });
  }

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI to notify the user they can add to home screen
      setIsInstall(false);
    });
  }, []);

  const { currents, scheduled, notyet, passed } = props;

  return (
    <div
      className="container 
    mx-auto mt-10"
    >
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-5xl font-bold mb-5 text-center">
          Jadwal Seminar Informatika
        </h1>
        <button
          className={`${isInstall ? "hidden" : "block"} bg-gradient-to-r ${currents.length !== 0
            ? " from-indigo-500 via-pink-500 to-yellow-500 hover:from-indigo-600 hover:via-pink-600 hover:to-red-600 "
            : " from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
            } text-white  rounded-lg focus:outline-none px-5 py-2 font-semibold`}
          onClick={listenUserAction}
        >
          Install
        </button>
      </div>
      {currents.length !== 0 &&
        currents.map((e, i) => {
          return <Item e={e} key={e.nim + i} classes="current" />;
        })}
      {notyet.length !== 0 && (
        <div className="p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-purple-300 border-purple-800 w-max">
          Coming Soon!
        </div>
      )}
      {notyet.map((e, i) => {
        return <Item e={e} key={e.nim + i} classes="notyet" />;
      })}
      {scheduled.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-yellow-300 border-yellow-800 w-max">
          Belum Ada Jadwalnya
        </div>
      )}
      {scheduled.map((e, i) => {
        return <Item e={e} key={e.nim + i} classes="scheduled" />;
      })}
      {passed.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-gray-300 border-gray-500 w-max">
          Udah Lewat
        </div>
      )}
      {passed
        .map((e, i) => {
          return <Item e={e} key={e.nim + i} classes="passed" />;
        })
        .reverse()}
    </div>
  );
}

const Item = (props) => {
  const { e, classes } = props;
  return (
    <div className={`items ${classes}`}>
      <div className={`${classes === "current" ? "gradient" : null}`}>
        <div className={`font-bold text-xl mb-2`}>{e.judul}</div>
        <div className="">
          <span className="uppercase font-semibold">{e.nama} </span>
          <span> - </span>
          <span className="font-semibold">{e.nim}</span>
        </div>
        <div className="mb-5">
          {e.date.day.hari !== "" && (
            <div className="flex items-center flex-row my-1">
              <HiOutlineCalendar className=" mr-2" />
              <span>
                {e.date.day.hari}, {e.date.day.tanggal} - {e.date.day.bulanAsli}{" "}
                - {e.date.day.tahun}
              </span>
            </div>
          )}
          {e.date.time !== "" && (
            <div className="flex flex-row items-center mb-1">
              <HiOutlineClock className="mr-2" />
              <span>
                {e.date.time.jamMulai} - {e.date.time.jamAkhir} WITA
              </span>
            </div>
          )}
          {e.jadwal.ruang !== "" && (
            <div className="flex flex-row items-center ">
              <HiOutlineLocationMarker className="mr-2" />
              <span>{e.jadwal.ruang}</span>
            </div>
          )}
          {e.sempro && (
            <div className="flex flex-row items-center mt-4">
              <HiDocument className="mr-2" />
              <span>Seminar Proposal</span>
            </div>
          )}
          {e.semhas && (
            <div className="flex flex-row items-center mt-4">
              <HiPresentationChartLine className="mr-2" />
              <span>Seminar Hasil</span>
            </div>
          )}
          {e.pendadaran && (
            <div className="flex flex-row items-center mt-4">
              <MdSchool className="mr-2" />
              <span>Sidang Akhir</span>
            </div>
          )}
        </div>
        {Date.now() <= e.dateInt.akhir && classes === "current" && (
          <>
            <div className="font-medium mb-2">Berakhir dalam:</div>
            <Countdown renderer={MyCoundown} date={e.dateInt.akhir} className="font-semibold" />
          </>
        )}
        {Date.now() <= e.dateInt.mulai && classes === "notyet" && (
          <div>
            <div className="font-medium mb-2">Dimulai dalam:</div>
            <Countdown renderer={MyCoundown} date={e.dateInt.mulai} className="font-semibold" />
          </div>
        )}
      </div>
    </div>
  );
};

const MyCoundown = ({ formatted }) => {

  const { days, hours, minutes, seconds } = formatted;
  return <div className="flex" suppressHydrationWarning={true}>
    <Time time="Hari" count={days} />
    <Time time="Jam" count={hours} />
    <Time time="Menit" count={minutes} />
    <Time time="Detik" count={seconds} />
  </div>
}


const Time = ({ count, time }) => {

  if (count === '00' && time !== 'Detik') return null;

  return (
    <div className="flex flex-col items-center justify-center mr-2">
      <div suppressHydrationWarning={true} className="mb-1 rounded-full p-1 w-7 text-sm text-center bg-black text-zinc-50">{count}</div>
      <div className="text-zinc-100">{time}</div>
    </div>
  );
}