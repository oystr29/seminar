import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";
import ErrorPage from "~/components/ErrorPage";
import { type DataSeminar } from "~/server/routers/hello";
import { AiOutlineSearch } from "react-icons/ai";
import { type InputHTMLAttributes, useState } from "react";
import ItemLoading from "~/components/ItemLoading";

const InputSearch = (
  props: InputHTMLAttributes<HTMLInputElement> & { data?: DataSeminar }
) => {
  const hasCurrent = props.data ? props.data.currents.length > 0 : false;
  return (
    <div className="relative">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <AiOutlineSearch className="w-5 h-5 text-gray-400" />
      </div>
      <input
        {...props}
        type="search"
        id="default-search"
        className={`block w-full p-4 pl-10 ${hasCurrent ? "focus:border-emerald-500" : "focus:border-purple-500"
          } outline-none text-sm  border rounded-lg  bg-gray-900 border-gray-600 placeholder-gray-400 text-white`}
        placeholder="Cari Judul, Nama, atau NIM"
      />
    </div>
  );
};

const HomeClientLoading = () => {
  const arrayLoading = Array.from({ length: 6 }, (_, i) => i);

  return (
    <>
      <div className="flex mb-5 w-full sm:justify-end">
        <InputSearch />
      </div>
      <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-white rounded-xl border-2 border-white">
        Loading...
      </div>
      {arrayLoading.map((al) => (
        <ItemLoading key={`item-load-${al}`} />
      ))}
    </>
  );
};

const HomeClient = ({ dataSeminar }: { dataSeminar: DataSeminar }) => {
  const [data, setData] = useState(dataSeminar);

  return (
    <>
      <div className="flex mb-5 w-full sm:justify-end">
        <InputSearch
          data={dataSeminar}
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
      {data.currents.length !== 0 &&
        data.currents.map((e, i) => {
          return <Item e={e} key={`${e.nim}${i}`} type="current" />;
        })}
      {data.notyet.length !== 0 && (
        <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-purple-300 rounded-xl border-2 border-purple-800">
          Coming Soon!
        </div>
      )}
      {data.notyet.map((e, i) => {
        return <Item e={e} key={`${e.nim}${i}`} type="notyet" />;
      })}
      {data.scheduled.length !== 0 && (
        <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-yellow-300 rounded-xl border-2 border-yellow-800">
          Belum Ada Jadwalnya
        </div>
      )}
      {data.scheduled.map((e, i) => {
        return <Item e={e} key={`${e.nim}${i}`} type="scheduled" />;
      })}
      {data.passed.length !== 0 && (
        <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-gray-300 rounded-xl border-2 border-gray-500">
          Udah Lewat
        </div>
      )}
      {data.passed
        .map((e, i) => {
          return <Item e={e} key={`${e.nim}${i}`} type="passed" />;
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

  if (!data) return <HomeClientLoading />;
  if (isError) {
    return <ErrorPage />;
  }

  return <HomeClient dataSeminar={data} />;
}
