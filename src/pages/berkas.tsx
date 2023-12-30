import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";
import { trpc } from "~/utils/trpc";

export default function Berkas() {
  const router = useRouter();
  const { dir } = router.query;
  const { data: folders } = trpc.docs.folder.useQuery();

  const { data: files } = trpc.docs.berkas.useQuery(
    folders?.some((e) => e.id === dir) ? dir : folders?.[0].id,
    {
      enabled: !!folders,
    }
  );

  return (
    <>
      <Head>
        <title>Berkas</title>
      </Head>
      <div className="pb-10">
        <div className="flex items-center gap-4 mb-4">
          {folders?.map((folder, i) => (
            <button
              onClick={async () => {
                await router.push({ pathname: "", query: { dir: folder.id } }, undefined, {
                  shallow: true,
                });
              }}
              className={cn(
                "py-1 px-2 rounded-lg",
                (dir === folder.id || ((!dir || !folders.some((e) => e.id === dir)) && i === 0)) &&
                  "bg-purple-950 text-purple-500 border border-purple-500"
              )}
              key={folder.id}
            >
              {folder.name}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
          {files?.map((file) => (
            <div className="rounded-lg w-72 h-72 bg-gray-950 pt-3 px-2" key={file.id}>
              <div className="flex items-center gap-2">
                <Image src={file.iconLink ?? ""} alt={"icon"} width={20} height={20} />
                <div className="truncate">{file.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
