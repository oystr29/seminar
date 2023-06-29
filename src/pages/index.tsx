import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";
import ErrorPage from "~/components/ErrorPage";
import { type DataSeminar } from "~/server/routers/hello";
import { AiOutlineSearch } from "react-icons/ai";
import { type InputHTMLAttributes, useState } from "react";
import ItemLoading from "~/components/ItemLoading";
import Select from "react-tailwindcss-select";
import { type ClassNames } from "react-tailwindcss-select/dist/components/type";

const InputSearch = (
  props: InputHTMLAttributes<HTMLInputElement> & { data?: DataSeminar }
) => {
  const hasCurrent = props.data ? props.data.currents.length > 0 : false;
  return (
    <div className="relative mr-4">
      <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
        <AiOutlineSearch className="w-5 h-5 text-gray-400" />
      </div>
      <input
        {...props}
        type="search"
        id="default-search"
        className={`block w-full p-2 pl-10 ${hasCurrent ? "focus:border-emerald-500" : "focus:border-purple-500"
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
      <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-white rounded-xl border-2 border-white">
        Loading...
      </div>
      {arrayLoading.map((al) => (
        <ItemLoading key={`item-load-${al}`} />
      ))}
    </>
  );
};

const classNames: ClassNames = {
  menuButton: () =>
    `flex w-max text-sm text-gray-50 border border-gray-600 rounded-lg shadow-sm transition-all duration-300 focus:outline-none bg-slate-900 hover:border-gray-400 focus:border-purple-500 focus:ring focus:ring-blue-purple/20`,
  menu: "absolute z-10 w-full bg-slate-950 shadow-lg  rounded py-1 mt-1.5 text-sm text-gray-700",
  searchBox:
    "w-full py-2 pl-8 text-sm text-gray-500 bg-slate-950 border border-gray-500 rounded focus:border-purple-300 focus:ring-0 focus:outline-none",

  listItem: ({
    // @ts-ignore
    isSelected,
  }) =>
    `block transition w-full duration-200 px-2 py-2 mb-1 cursor-pointer select-none truncate rounded ${isSelected
      ? `text-white bg-purple-500`
      : `text-gray-400 hover:bg-purple-200 hover:text-purple-600`
    }`,
};

export default function Home() {
  const [sheetValue, setSheetValue] = useState({
    label: `${process.env.NEXT_PUBLIC_SHEET_NAME}`,
    value: `${process.env.NEXT_PUBLIC_SHEET_NAME}`,
  });

  const [search, setSearch] = useState("");

  const { data, isError } = trpc.hello.seminar.useQuery(
    { sheet_name: sheetValue.value, search },
    {
      onError(err) {
        console.log(err);
      },
    }
  );

  const { data: sheets } = trpc.hello.sheets.useQuery(undefined);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="flex items-center mb-5 w-full sm:justify-end">
        <InputSearch
          data={data}
          value={search}
          onChange={(e) => {
            const { value } = e.currentTarget;
            setSearch(value);
          }}
        />
        <div className="w-min">
          {!sheets ? (
            <Select
              options={[{ label: "Loading", value: "Loading..." }]}
              value={{ label: "Loading...", value: "Loading..." }}
              placeholder="Loading..."
              classNames={classNames}
              onChange={() => { }}
              primaryColor="purple"
            />
          ) : (
            <Select
              options={sheets?.map((s) => ({
                label: `${s.properties?.title}`,
                value: `${s.properties?.title}`,
              }))}
              value={sheetValue}
              placeholder="Loading..."
              classNames={classNames}
              onChange={(e) => {
                // @ts-ignore
                setSheetValue(e);
              }}
              primaryColor="purple"
            />
          )}
        </div>
      </div>
      {!data ? (
        <HomeClientLoading />
      ) : (
        <>
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
      )}
    </>
  );
}
