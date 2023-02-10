
import { DataSem } from "..";
import Home from "./components/Home";

export const metadata = {
  title: 'Seminar IF Unmul',
  description: 'Website Seminar Informatika Unmul',
}

async function getSeminarData() {
  const base =
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://seminar.dalamkotak.com";
  const res = await fetch(`${base}/api/hello`, { cache: 'no-store' });
  const seminar = await res.json();

  return seminar;
}


export default async function Page() {
  const seminar = await getSeminarData() as DataSem;

  return (
    <Home {...seminar} />
  );
}






