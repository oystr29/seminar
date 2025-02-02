/* eslint-disable @next/next/no-img-element */
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Flashlist from "~/components/Flashlist";
import SkeletonLoad from "~/components/SkeletonLoad";
import { cn, listSkel } from "~/lib/utils";
import { trpc } from "~/utils/trpc";

export default function Berkas() {
  const tabsRef = useRef<Record<string, HTMLElement | null>>({});
  const imgsRef = useRef<Record<string, HTMLImageElement | null | undefined>>(
    {},
  );
  const [tabUnderlineWidth, setTabUnderlineWidth] = useState(0);
  const [tabUnderlineLeft, setTabUnderlineLeft] = useState(0);
  const router = useRouter();
  const { dir, s } = router.query;

  const { data: folders, isLoading: loadFolders } = trpc.docs.folder.useQuery();

  const { data: files, isLoading: loadFiles } = trpc.docs.berkas.useQuery(
    {
      dir_id: folders?.some((e) => e.id === dir) ? dir : folders?.[0].id,
      search: s ?? "",
    },
    {
      enabled: !!folders,
    },
  );

  useEffect(() => {
    const currDir = `${dir ?? folders?.[0].id}`;
    const currentTab = tabsRef.current[currDir] as HTMLElement;
    setTabUnderlineLeft(currentTab?.offsetLeft ?? 0);
    setTabUnderlineWidth(currentTab?.clientWidth ?? 0);
  }, [dir, folders]);

  return (
    <>
      <Head>
        <title>Seminar IF - Berkas</title>
      </Head>
      <div className="pb-10 flex items-center flex-col justify-center sm:block">
        <div
          id="tabs-container"
          className="relative flex items-center h-12 gap-2 overflow-x-auto w-full p-1 md:p-0 mb-4"
        >
          <span
            className="absolute bottom-0 top-0 -z-10 flex overflow-hidden rounded-3xl py-2 transition-all duration-300"
            style={{ left: tabUnderlineLeft, width: tabUnderlineWidth }}
          >
            <span
              className={cn(
                "h-full w-full rounded-3xl bg-violet-600 transition-all",
              )}
            />
          </span>
          <Flashlist
            isLoading={loadFolders}
            loadingRender={listSkel(
              (k) => (
                <SkeletonLoad key={`folder-${k}`} width={97} height={23} />
              ),
              3,
            )}
          >
            {folders?.map((folder) => {
              const currDir = dir ?? folders?.[0].id;
              const isActive = folder.id === currDir;

              return (
                <button
                  ref={(el) => {
                    if (folder.id) {
                      tabsRef.current[folder.id] = el;
                    }
                  }}
                  onClick={async () => {
                    if (dir === folder.id) return;

                    if (folder.id === folders?.[0].id) {
                      router.replace("");
                      return;
                    }

                    router.replace(
                      {
                        pathname: "",
                        query: {
                          ...router.query,
                          dir: folder.id,
                        },
                      },
                      undefined,
                      {
                        shallow: true,
                      },
                    );
                  }}
                  className={cn(
                    "whitespace-nowrap my-auto cursor-pointer select-none rounded-full px-4 text-center font-light text-white capitalize",
                    !isActive && "hover:text-neutral-300",
                  )}
                  key={folder.id}
                >
                  {folder.name}
                </button>
              );
            })}
          </Flashlist>
        </div>
        <div
          className={cn(
            "grid justify-items-center md:justify-items-start grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full",
            files?.length === 0 && "block",
          )}
        >
          <Flashlist
            isFallback={files?.length === 0}
            fallbackRender={
              <div className="text-xl w-full text-clip">
                {s
                  ? `Pencarian Berkas '${s as string}' tidak ditemukan 🤔`
                  : "Sepertinya tidak ada berkas yang muncul 🤨"}
              </div>
            }
            isLoading={loadFiles}
            loadingRender={listSkel(
              (k) => (
                <div
                  key={`files-${k}`}
                  className="rounded-lg flex flex-col h-72 w-72 bg-gray-950 pt-3 px-2 pb-2"
                >
                  <div className="flex items-center gap-2">
                    <SkeletonLoad width={20} height={20} />
                    <SkeletonLoad width={150} height={20} />
                  </div>
                  <SkeletonLoad
                    containerClassName="flex-1 w-full mt-1 rounded-lg"
                    className="h-full"
                  />
                </div>
              ),
              6,
            )}
          >
            {files?.map((file) => (
              <a
                href={file.webViewLink ?? ""}
                target="_blank"
                rel="noreferrer"
                className="relative rounded-lg flex flex-col h-72 w-72 hover:scale-105 transition-all group antialiased"
                key={file.id}
              >
                <div className="flex items-start gap-2 transition-all absolute top-0 left-0 w-full right-0 bg-gray-900/80 px-4 py-2.5  rounded-t-md antialiased">
                  <img
                    loading="lazy"
                    src={file.iconLink ?? ""}
                    alt={"icon"}
                    width={20}
                    height={20}
                    className="transition-all mt-0.5"
                  />
                  <div className="">{file.name}</div>
                </div>
                <div className="bg-gray-900/80 p-2 absolute bottom-0 right-0 rounded-br-md text-xs rounded-tl-md antialiased">
                  {dayjs(file.modifiedTime).format("MMMM YY")}
                </div>
                <img
                  ref={(el) => {
                    if (file.id) {
                      imgsRef.current[file.id] = el;
                    }
                  }}
                  loading="lazy"
                  width={200}
                  height={0}
                  placeholder="blur"
                  // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN0dnc+AwADPQGbOTvFkgAAAABJRU5ErkJggg=="
                  alt={file.name ?? ""}
                  src={file.thumbnailLink ?? ""}
                  onError={(e) => {
                    // console.error(e);
                    if (
                      file.id &&
                      imgsRef.current &&
                      imgsRef.current[file.id]
                    ) {
                      // @ts-expect-error gapapa gan
                      imgsRef.current[file.id].src =
                        "https://placehold.co/600x400?text=(•ᴗ•)";
                    }
                  }}
                  className="flex-1 w-full h-9 rounded-lg object-cover object-top transition-all"
                />
              </a>
            ))}
          </Flashlist>
        </div>
      </div>
    </>
  );
}
