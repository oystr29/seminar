import React, { useEffect, useState } from "react";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="container px-4 sm:px-0 sm:mx-auto mt-10 min-h-screen h-full">
        {children}
      </main>
      <Footer />
    </>
  );
}
