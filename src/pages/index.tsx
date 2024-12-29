/* eslint-disable @typescript-eslint/ban-ts-comment */
import { trpc } from "~/utils/trpc";
import Item from "~/components/Item";
import ErrorPage from "~/components/ErrorPage";
import ItemLoading from "~/components/ItemLoading";
import { useRouter } from "next/router";
import Flashlist from "~/components/Flashlist";
import SkeletonLoad from "~/components/SkeletonLoad";
import { cn, listSkel } from "~/lib/utils";
import { useEffect, useRef, useState } from "react";

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
  const tabsRef = useRef<Record<string, HTMLElement | null>>({});
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);

  const router = useRouter();
  const { s, sh } = router.query;

  const { data: sheets, isLoading: loadSheets } = trpc.hello.sheets.useQuery();

  const { data, isError, isLoading } = trpc.hello.seminar.useQuery(
    {
      sheet_name: sh ?? sheets?.currSheet,
      search: s,
    },
    { enabled: !!sheets },
  );

  useEffect(() => {
    const currSheet = `${sh ?? sheets?.currSheet}`;
    const currentTab = tabsRef.current[currSheet] as HTMLElement;
    setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
  }, [sh, sheets?.currSheet]);

  if (isError) {
    return <ErrorPage />;
  }

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row items-center gap-4 mb-4">
        <div
          id="tabs-container"
          className="relative flex items-center h-12 gap-2 overflow-x-auto w-full p-1 md:p-0"
        >
          <span
            className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          >
            <span
              className={cn(
                "h-full w-full rounded-3xl bg-gray-200/30 transition-all",
                !!data?.scheduled.length && "bg-yellow-500",
                !!data?.notyet.length && "bg-violet-600",
                !!data?.currents.length &&
                  "bg-gradient-to-tr from-emerald-400 to-sky-600 text-white",
              )}
            />
          </span>
          <Flashlist
            isLoading={loadSheets}
            loadingRender={listSkel(
              (k) => (
                <SkeletonLoad key={`sheet-${k}`} width={97} height={23} />
              ),
              3,
            )}
          >
            {sheets?.data?.map((sheett) => {
              const currSheet = sh ?? sheets.currSheet;
              const isActive = sheett.properties?.title === currSheet;

              return (
                <button
                  id={sheett.properties?.title ?? ""}
                  ref={(el) => {
                    if (sheett?.properties?.title) {
                      tabsRef.current[sheett.properties.title] = el;
                    }
                  }}
                  onClick={async () => {
                    if (sh === sheett.properties?.title) return;

                    if (sheett.properties?.title === sheets.currSheet) {
                      router.replace("");
                      return;
                    }

                    router.replace(
                      {
                        pathname: "",
                        query: {
                          ...router.query,
                          sh: sheett.properties?.title,
                        },
                      },
                      undefined,
                      {
                        shallow: true,
                      },
                    );
                    // setSheet(sheett.properties?.title ?? undefined);
                  }}
                  className={cn(
                    "whitespace-nowrap my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white",
                    !isActive && "hover:text-neutral-300",
                  )}
                  key={sheett.properties?.title}
                >
                  {sheett.properties?.title}
                </button>
              );
            })}
          </Flashlist>
        </div>
      </div>
      <Flashlist
        isFallback={
          data?.currents.length === 0 &&
          data?.passed.length === 0 &&
          data.notyet.length === 0
        }
        fallbackRender={
          <div className="text-xl w-full text-clip">
            {s
              ? `Pencarian jadwal '${s as string}' tidak ditemukan 🤔`
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
