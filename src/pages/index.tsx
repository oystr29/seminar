/* eslint-disable @typescript-eslint/ban-ts-comment */
import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";
import ErrorPage from "~/components/ErrorPage";
import ItemLoading from "~/components/ItemLoading";
import { useRouter } from "next/router";
import { useDebounce } from "@uidotdev/usehooks";
import Flashlist from "~/components/Flashlist";
import SkeletonLoad from "~/components/SkeletonLoad";
import Search from "~/components/Search";
import { cn, listSkel } from "~/lib/utils";
import { useEffect, useState } from "react";

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

export default function Home() {
  const router = useRouter();
  const { s, sh } = router.query;
  const [search, setSearch] = useState<string | undefined | string[]>(
    s ?? undefined,
  );
  const [sheet, setSheet] = useState<string | undefined | string[]>(
    sh ?? undefined,
  );

  const debouncedSearch = useDebounce(search, 600);

  const { data: sheets, isLoading: loadSheets } = trpc.hello.sheets.useQuery();

  const { data, isError, isLoading } = trpc.hello.seminar.useQuery(
    {
      sheet_name: sheets?.some((e) => e.properties?.title === sheet)
        ? sheet
        : sheets?.[0].properties?.title,
      search: s,
    },
    { enabled: !!sheets },
  );

  useEffect(() => {
    if (debouncedSearch !== undefined) {
      router.replace(
        { pathname: "", query: { ...router.query, s: debouncedSearch } },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [debouncedSearch]);

  useEffect(() => {
    if (sheet !== undefined) {
      router.replace(
        { pathname: "", query: { ...router.query, sh: sheet } },
        undefined,
        {
          shallow: true,
        },
      );
    }
  }, [sheet]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 mb-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full p-1 md:p-0">
          <Flashlist
            isLoading={loadSheets}
            loadingRender={listSkel(
              (k) => (
                <SkeletonLoad key={`sheet-${k}`} width={97} height={23} />
              ),
              3,
            )}
          >
            {sheets?.map((sh, i) => {
              const isActive =
                sheet === sh.properties?.title ||
                ((!sheet ||
                  !sheets.some((e) => e.properties?.title === sheet)) &&
                  i === 0);

              const isLoad = isActive && isLoading;

              const isComing =
                isActive && !!data?.notyet && data?.notyet?.length > 0;
              const isPresent =
                isActive && !!data?.currents && data?.currents?.length > 0;
              const isDone =
                isActive && !!data?.passed && data?.passed?.length > 0;
              const isScheduled =
                isActive && !!data?.scheduled && data.scheduled.length > 0;

              return (
                <button
                  id={sh.properties?.title ?? ""}
                  onClick={async () => {
                    setSheet(sh.properties?.title ?? undefined);
                  }}
                  className={cn(
                    "py-1 px-2 rounded-lg whitespace-nowrap bg-gray-950/50 hover:bg-gray-950/90 text-white/80",
                    isLoad && "bg-white text-black hover:bg-white/90",
                    (isDone || isActive) &&
                      "bg-gray-300 text-black hover:bg-gray-400",
                    isComing &&
                      "bg-violet-950 text-violet-400  hover:bg-violet-950/90",
                    isPresent &&
                      "bg-gradient-to-tr from-green-500 to-sky-500 text-white",
                    isScheduled &&
                      "bg-yellow-950 text-yellow-400  hover:bg-yellow-950/90",
                  )}
                  key={sh.properties?.title}
                >
                  {sh.properties?.title}
                </button>
              );
            })}
          </Flashlist>
        </div>
        <Search
          disabled={loadSheets}
          defaultValue={search as string}
          placeholder={loadSheets ? "Loading..." : "Cari Judul, Nama, atau NIM"}
          onChange={(e) => setSearch(e.target.value ?? "")}
        />
      </div>
      <Flashlist
        isFallback={
          data?.currents.length === 0 &&
          data?.passed.length === 0 &&
          data.notyet.length === 0
        }
        fallbackRender={
          <div className="text-xl w-full text-clip">
            {search
              ? `Pencarian jadwal '${search as string}' tidak ditemukan 🤔`
              : "Sepertinya tidak ada jadwal yang muncul 🤨"}
          </div>
        }
        isLoading={!data || isLoading}
        loadingRender={<HomeClientLoading />}
      >
        {data?.currents.length !== 0 &&
          data?.currents.map((e, i) => {
            return <Item e={e} key={`${e.nim}${i}`} type="current" />;
          })}
        {data?.notyet.length !== 0 && (
          <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-purple-300 rounded-xl border-2 border-purple-800 flex items-center gap-2">
            Coming Soon!{" "}
            <span className="text-xs px-1 py-0.5 rounded-full bg-violet-950 text-violet-400">
              {data?.notyet.length}
            </span>
          </div>
        )}
        {data?.notyet.map((e, i) => {
          return <Item e={e} key={`${e.nim}${i}`} type="notyet" />;
        })}
        {data?.scheduled.length !== 0 && (
          <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-yellow-300 rounded-xl border-2 border-yellow-800 flex items-center gap-2">
            Belum Ada Jadwalnya
            <span className="text-xs px-1 py-0.5 rounded-full bg-yellow-950 text-yellow-400">
              {data?.scheduled.length}
            </span>
          </div>
        )}
        {data?.scheduled.map((e, i) => {
          return <Item e={e} key={`${e.nim}${i}`} type="scheduled" />;
        })}
        {data?.passed.length !== 0 && (
          <div className="p-1 px-2 mt-3 mb-2 w-max text-base text-gray-300 rounded-xl border-2 border-gray-500 flex items-center gap-2">
            Udah Lewat
            <span className="text-xs px-1 py-0.5 rounded-full bg-gray-950 text-gray-400">
              {data?.passed.length}
            </span>
          </div>
        )}
        {data?.passed
          .map((e, i) => {
            return <Item e={e} key={`${e.nim}${i}`} type="passed" />;
          })
          .reverse()}
      </Flashlist>
    </>
  );
}
