import { trpc } from "~/utils/trpc";

const Page = () => {
  const { data } = trpc.docs.pkl.useQuery();

  console.log(data);
  return <div>Makan</div>;
};

export default Page;
