import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";

export default function Home() {
  const { data } = trpc.hello.seminar.useQuery();

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {data.currents.length !== 0 &&
        data.currents.map((e, i) => {
          return <Item e={e} key={e.nim + i} type="current" />;
        })}
      {data.notyet.length !== 0 && (
        <div className="p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-purple-300 border-purple-800 w-max">
          Coming Soon!
        </div>
      )}
      {data.notyet.map((e, i) => {
        return <Item e={e} key={e.nim + i} type="notyet" />;
      })}
      {data.scheduled.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-yellow-300 border-yellow-800 w-max">
          Belum Ada Jadwalnya
        </div>
      )}
      {data.scheduled.map((e, i) => {
        return <Item e={e} key={e.nim + i} type="scheduled" />;
      })}
      {data.passed.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-gray-300 border-gray-500 w-max">
          Udah Lewat
        </div>
      )}
      {data.passed
        .map((e, i) => {
          return <Item e={e} key={e.nim + i} type="passed" />;
        })
        .reverse()}
      <div className="flex justify-center items-center py-5">
        <a
          href="https://s.id/JadwalSeminarSkripsi"
          target="_blank"
          rel="noreferrer"
          className="mr-5 text-green-500 hover:underline font-bold cursor-pointer hover:text-green-300"
        >
          Source Data
        </a>
        <a
          href="https://github.com/oktoala/seminar"
          target="_blank"
          rel="noreferrer"
          className="text-fuchsia-500 hover:underline font-bold cursor-pointer hover:text-fuchsia-300"
        >
          Source Code
        </a>
      </div>
    </>
  );
}
