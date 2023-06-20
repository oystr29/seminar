import Head from "next/head";
import type { AppProps } from "next/app";
import Script from "next/script";
import { trpc } from "~/utils/trpc";
import Layout from "~/pages/_layout";
import "../styles/globals.css";
import "react-loading-skeleton/dist/skeleton.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
      />

      <Script id="onload" strategy="lazyOnload">
        {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
                    page_path: window.location.pathname,
                    });
                `}
      </Script>
      <Head>
        <meta name="application-name" content="Seminar App" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Seminar App" />
        <meta
          name="description"
          content="Untuk kalian yang mau nonton Seminar"
        />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta
          name="msapplication-config"
          content="/assets/icons/browserconfig.xml"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.webmanifest" />

        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="/assets/icons/ios/57.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="60x60"
          href="/assets/icons/ios/60.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="72x72"
          href="/assets/icons/ios/72.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/assets/icons/ios/76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/assets/icons/ios/114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/assets/icons/ios/144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/assets/icons/ios/120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/assets/icons/ios/152.png"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/icons/android/android-launchericon-192-192.png"
          sizes="192x192"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/icons/android/android-launchericon-96-96.png"
          sizes="96x96"
        />
        <link
          rel="icon"
          type="image/png"
          href="/assets/icons/android/android-launchericon-128-128.png"
          sizes="128x128"
        />
        <meta name="application-name" content="&nbsp;" />
        <meta name="msapplication-TileColor" content="#FFFFFF" />
        <meta
          name="msapplication-square150x150logo"
          content="/assets/icons/windows11/Square44x44Logo.scale-150.png"
        />

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:url" content="https://seminar.dalamkotak.com" />
        <meta name="twitter:title" content="Seminar IF" />
        <meta
          name="twitter:description"
          content="Web Untuk Seminar Informatika Unmul"
        />
        <meta
          name="twitter:image"
          content="https://cc-og-image.vercel.app/**Seminar%20IF**.png?theme=dark&md=1&fontFamily=roboto-condensed&fontSize=100px&images=https%3A%2F%2Fcc-vocabulary.netlify.app%2Flogos%2Fcc%2Flettermark.svg%23lettermark&images=https%3A%2F%2Fpic.onlinewebfonts.com%2Fsvg%2Fimg_452496.png&widths=auto&heights=auto"
        />
        <meta name="twitter:creator" content="@oktoala" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Seminar IF" />
        <meta property="og:description" content="Seminar Informatika Unmul" />
        <meta
          property="og:site_name"
          content="Untuk kalian yang mau nonton Seminar"
        />
        <meta property="og:url" content="https://seminar.dalamkotak.com" />
        <meta
          property="og:image"
          content="https://cc-og-image.vercel.app/**Seminar%20IF**.png?theme=dark&md=1&fontFamily=roboto-condensed&fontSize=100px&images=https%3A%2F%2Fcc-vocabulary.netlify.app%2Flogos%2Fcc%2Flettermark.svg%23lettermark&images=https%3A%2F%2Fpic.onlinewebfonts.com%2Fsvg%2Fimg_452496.png&widths=auto&heights=auto"
        />

        <title>Seminar IF</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default trpc.withTRPC(MyApp);
