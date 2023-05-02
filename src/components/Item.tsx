import Countdown, { CountdownRenderProps } from "react-countdown";
import {
  HiDocument,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineLocationMarker,
  HiPresentationChartLine,
} from "react-icons/hi";
import { MdSchool } from "react-icons/md";
import FlipClockCountdown from "~/components/FlipClockCountdown";
import { Seminar } from "~/server/routers/hello";
import { trpc } from "~/utils/trpc";

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

type TypeSem = "current" | "notyet" | "scheduled" | "passed";

const Item = (props: { e: Seminar; type: TypeSem }) => {
  const utils = trpc.useContext();

  const getClasess = (t: TypeSem) => {
    let className = "";
    if (t === "current") {
      className = "border-none bg-gradient-to-tr p-1 from-green-500 to-sky-500";
    } else if (t === "scheduled") {
      className = "border-yellow-400";
    } else if (t === "notyet") {
      className = "border-purple-400 ";
    } else if (t === "passed") {
      className = "border-gray-500 text-gray-400";
    }
    return className;
  };

  const { e, type } = props;

  return (
    <div
      className={`mb-5 border-2 rounded-lg ${
        type !== "current" && "p-5"
      }  text-white ${getClasess(type)}`}
    >
      <div
        className={`${
          type === "current" ? "gradient rounded-lg bg-zinc-900 p-4" : null
        }`}
      >
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
        {Date.now() <= e.dateInt.akhir && type === "current" && (
          <>
            <div className="font-medium mb-2">Berakhir dalam:</div>
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={() => {
                console.log("Refetch Done");
                utils.hello.seminar.refetch();
              }}
              to={e.dateInt.akhir}
            />
          </>
        )}
        {Date.now() <= e.dateInt.mulai && type === "notyet" && (
          <div>
            <div className="font-medium mb-2">Dimulai dalam:</div>
            {/* <Countdown
              renderer={MyCountdown}
              date={e.dateInt.mulai}
              className="font-semibold"
            /> */}
            <FlipClockCountdown
              showSeparators={false}
              className="flip-clock"
              labels={["Hari", "Jam", "Menit", "Detik"]}
              onComplete={() => {
                console.log("Refetch");
                utils.hello.seminar.refetch();
              }}
              to={e.dateInt.mulai}
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default Item;
