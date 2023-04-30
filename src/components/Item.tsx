import Countdown, { CountdownRenderProps } from "react-countdown";
import {
  HiDocument,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiPresentationChartLine,
} from "react-icons/hi";
import { MdSchool } from "react-icons/md";
import { Seminar } from "~/server/routers/hello";

const Time = ({ count, time }: { count: string; time: string }) => {
  if (count === "00" && time !== "Detik") return null;

  return (
    <div className="flex flex-col items-center justify-center mr-2">
      <div
        suppressHydrationWarning={true}
        className="mb-1 rounded-lg p-1 w-7 text-sm text-center bg-black text-zinc-50"
      >
        {count}
      </div>
      <div className="text-zinc-100">{time}</div>
    </div>
  );
};

const MyCountdown = ({ formatted }: CountdownRenderProps) => {
  const { days, hours, minutes, seconds } = formatted;
  return (
    <div className="flex">
      <Time time="Hari" count={days} />
      <Time time="Jam" count={hours} />
      <Time time="Menit" count={minutes} />
      <Time time="Detik" count={seconds} />
    </div>
  );
};

const Item = (props: { e: Seminar; classes: string }) => {
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
          {e.date.time && (
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
            <Countdown
              renderer={MyCountdown}
              date={e.dateInt.akhir}
              className="font-semibold"
            />
          </>
        )}
        {Date.now() <= e.dateInt.mulai && classes === "notyet" && (
          <div>
            <div className="font-medium mb-2">Dimulai dalam:</div>
            <Countdown
              renderer={MyCountdown}
              date={e.dateInt.mulai}
              className="font-semibold"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Item;
