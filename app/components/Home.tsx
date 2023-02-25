"use client";

import { useEffect, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { DataSem } from "../..";
import Item from "./Item";

export default (props: DataSem) => {
  const [data, setData] = useState(props);
  const { currents, notyet, scheduled, passed, sheetName } = data;
  const { sheets } = props;
  const [currentParent] = useAutoAnimate();
  const [notyetParent] = useAutoAnimate();
  const [passedParent] = useAutoAnimate();

  return (
    <>
      <section className="flex items-center mb-5">
        {sheets?.map((sheet) => (
          <button
            onClick={async () => {
              const base = process.env.NEXT_PUBLIC_API_URL;
              const res = await fetch(
                `${base}/api/data?sheet=${sheet.properties?.title}`,
                {
                  cache: "no-store",
                }
              );
              const dataa = await res.json();
              setData(dataa);
            }}
            key={sheet.properties?.title}
            className={`border border-white ${
              sheetName === sheet.properties?.title && "bg-white text-gray-900"
            } px-3 py-1 rounded-xl mr-4`}
          >
            {sheet.properties?.title}
          </button>
        ))}
      </section>
      <section ref={currentParent}>
        {currents.length !== 0 &&
          currents.map((e, i) => {
            return (
              <Item setData={setData} e={e} key={e.nim + i} classes="current" />
            );
          })}
      </section>
      {notyet.length !== 0 && (
        <div className="p-1 px-2 mb-2 rounded-xl mt-3 text-base border-2 text-purple-50 border-purple-800 w-max">
          Coming Soon!
        </div>
      )}
      <section ref={notyetParent}>
        {notyet.map((e, i) => {
          return (
            <Item setData={setData} e={e} key={e.nim + i} classes="notyet" />
          );
        })}
      </section>
      {scheduled.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-yellow-300 border-yellow-800 w-max">
          Belum Ada Jadwalnya
        </div>
      )}
      {scheduled.map((e, i) => {
        return (
          <Item setData={setData} e={e} key={e.nim + i} classes="scheduled" />
        );
      })}
      {passed.length !== 0 && (
        <div className="p-1 px-2 mb-2 mt-3 rounded-xl text-base border-2 text-gray-300 border-gray-500 w-max">
          Udah Lewat
        </div>
      )}
      <section ref={passedParent}>
        {passed
          .map((e, i) => {
            return (
              <Item setData={setData} e={e} key={e.nim + i} classes="passed" />
            );
          })
          .reverse()}
      </section>
      <div className="flex justify-center items-center py-5">
        <a
          href="https://s.id/JadwalSeminarSkripsi"
          target="_blank"
          rel="noreferrer"
          className="mr-5 text-green-500 hover:underline font-bold cursor-pointer hover:text-green-300"
        >
          Source Data
        </a>
        <a
          href="https://github.com/oktoala/seminar"
          target="_blank"
          rel="noreferrer"
          className="text-fuchsia-500 hover:underline font-bold cursor-pointer hover:text-fuchsia-300"
        >
          Source Code
        </a>
      </div>
    </>
  );
};
