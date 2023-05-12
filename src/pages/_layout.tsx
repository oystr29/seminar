import React, { useEffect, useState } from "react";
import Header from "~/components/Header";


export default function Layout({ children }: { children: React.ReactNode }) {
  
  return (
    <>
      <Header />
      <main className="container mx-auto mt-10">
        {children}
      </main>
    </>
  );
}
