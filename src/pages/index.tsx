import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";
import ErrorPage from "~/components/ErrorPage";
import { Seminar, DataSeminar } from "~/server/routers/hello";
import { AiOutlineSearch } from "react-icons/ai";
import { useState } from "react";

const HomeClient = ({ dataSeminar }: { dataSeminar: DataSeminar }) => {
  const [data, setData] = useState<DataSeminar>(dataSeminar);
  return (
    <>
      <div className="w-full mb-5 flex sm:justify-end">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <AiOutlineSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="search"
            id="default-search"
            className={`block w-full p-4 pl-10 outline-none text-sm  border rounded-lg  bg-gray-900 border-gray-600 placeholder-gray-400 text-white ${
              data.currents.length > 0
                ? "focus:ring-emerald-500 focus:border-emerald-500"
                : "focus:ring-purple-500 focus:border-purple-500"
            }  `}
            placeholder="Cari Judul, Nama, atau NIM"
            onChange={(e) => {
              const { value } = e.currentTarget;
              setData({
                currents: dataSeminar.currents.filter((entry) =>
                  Object.values(entry).some(
                    (val) =>
                      typeof val === "string" &&
                      val.toLowerCase().includes(value.toLowerCase())
                  )
                ),
                passed: dataSeminar.passed.filter((entry) =>
                  Object.values(entry).some(
                    (val) =>
                      typeof val === "string" &&
                      val.toLowerCase().includes(value.toLowerCase())
                  )
                ),
                notyet: dataSeminar.notyet.filter((entry) =>
                  Object.values(entry).some(
                    (val) =>
                      typeof val === "string" &&
                      val.toLowerCase().includes(value.toLowerCase())
                  )
                ),
                scheduled: dataSeminar.scheduled.filter((entry) =>
                  Object.values(entry).some(
                    (val) =>
                      typeof val === "string" &&
                      val.toLowerCase().includes(value.toLowerCase())
                  )
                ),
              });
            }}
          />
        </div>
      </div>
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
    </>
  );
};

export default function Home() {
  const { data, isError } = trpc.hello.seminar.useQuery(undefined, {
    onError(err) {
      console.log(err);
    },
  });

  if (isError) {
    return <ErrorPage />;
  }
  if (!data) return null;
  return <>Makan</>

  // return <HomeClient dataSeminar={data} />;
}
