import ErrorPage from "~/components/ErrorPage";
import { trpc } from "~/utils/trpc";

const Page = () => {
  const { data, isError } = trpc.docs.pkl.useQuery();

  if (isError) {
    return <ErrorPage />;
  }

  if (!data) return null;

  return (
    <div>
      <div className="">
        <h1 className="text-white font-bold text-xl mb-5">Dokumen PKL</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map(({ href, text }) => (
            <a
              key={href}
              className="rounded-lg hover:scale-105 border transition bg-gray-950 border-pink-600 p-4 text-lg font-semibold"
              href={href}
              target="_blank"
              rel="noreferrer"
            >
              {text}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
