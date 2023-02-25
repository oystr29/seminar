import { sheets_v4 } from "googleapis";
import { DataSem } from "..";
import Home from "./components/Home";

export const metadata = {
  title: "Seminar IF Unmul",
  description: "Website Seminar Informatika Unmul",
};
const base = process.env.NEXT_PUBLIC_API_URL;
async function getSheets(): Promise<sheets_v4.Schema$Sheet[] | undefined> {
  const res = await fetch(`${base}/api/sheets`, { cache: "no-store" });

  return res.json();
}

async function getSeminarData(): Promise<DataSem> {
  const res = await fetch(`${base}/api/data`, { cache: "no-store" });
  const seminar = await res.json();

  return seminar;
}

export default async function Page() {
  const seminar = await getSeminarData();
  console.log(seminar.sheetName);
  const sheets = await getSheets();

  return <Home {...seminar}  sheets={sheets} />;
}
