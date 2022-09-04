import Head from 'next/head';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <meta name="application-name" content="Seminar App" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Seminar App" />
      <meta name="description" content="Best PWA App in the world" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="msapplication-config" content="/assets/icons/browserconfig.xml" />
      <meta name="msapplication-TileColor" content="#9E38B3" />
      <meta name="msapplication-tap-highlight" content="no" />
      <meta name="theme-color" content="#000000" />
      <link rel="manifest" href="/manifest.webmanifest" />

      <link rel="apple-touch-icon" sizes="57x57" href="/assets/icons/apple-touch-icon-57x57.png" />
      <link rel="apple-touch-icon" sizes="114x114" href="/assets/icons/apple-touch-icon-114x114.png" />
      <link rel="apple-touch-icon" sizes="72x72" href="/assets/icons/apple-touch-icon-72x72.png" />
      <link rel="apple-touch-icon" sizes="144x144" href="/assets/icons/apple-touch-icon-144x144.png" />
      <link rel="apple-touch-icon" sizes="60x60" href="/assets/icons/apple-touch-icon-60x60.png" />
      <link rel="apple-touch-icon" sizes="120x120" href="/assets/icons/apple-touch-icon-120x120.png" />
      <link rel="apple-touch-icon" sizes="76x76" href="/assets/icons/apple-touch-icon-76x76.png" />
      <link rel="apple-touch-icon" sizes="152x152" href="/assets/icons/apple-touch-icon-152x152.png" />
      <link rel="icon" type="image/png" href="/assets/icons/favicon-196x196.png" sizes="196x196" />
      <link rel="icon" type="image/png" href="/assets/icons/favicon-96x96.png" sizes="96x96" />
      <link rel="icon" type="image/png" href="/assets/icons/favicon-32x32.png" sizes="32x32" />
      <link rel="icon" type="image/png" href="/assets/icons/favicon-16x16.png" sizes="16x16" />
      <link rel="icon" type="image/png" href="/assets/icons/favicon-128.png" sizes="128x128" />
      <meta name="application-name" content="&nbsp;" />
      <meta name="msapplication-TileColor" content="#FFFFFF" />
      <meta name="msapplication-TileImage" content="/assets/icons/mstile-144x144.png" />
      <meta name="msapplication-square70x70logo" content="/assets/icons/mstile-70x70.png" />
      <meta name="msapplication-square150x150logo" content="/assets/icons/mstile-150x150.png" />
      <meta name="msapplication-wide310x150logo" content="/assets/icons/mstile-310x150.png" />
      <meta name="msapplication-square310x310logo" content="/assets/icons/mstile-310x310.png" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:url" content="https://seminar.dalamkotak.com" />
      <meta name="twitter:title" content="Seminar IF" />
      <meta name="twitter:description" content="Web Untuk Seminar Informatika Unmul" />
      <meta name="twitter:image" content="https://cc-og-image.vercel.app/**Seminar%20IF**.png?theme=dark&md=1&fontFamily=roboto-condensed&fontSize=100px&images=https%3A%2F%2Fcc-vocabulary.netlify.app%2Flogos%2Fcc%2Flettermark.svg%23lettermark&images=https%3A%2F%2Fpic.onlinewebfonts.com%2Fsvg%2Fimg_452496.png&widths=auto&heights=auto" />
      <meta name="twitter:creator" content="@oktoala" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="Seminar IF" />
      <meta property="og:description" content="Seminar Informatika Unmul" />
      <meta property="og:site_name" content="PWA App" />
      <meta property="og:url" content="https://seminar.dalamkotak.com" />
      <meta property="og:image" content="https://cc-og-image.vercel.app/**Seminar%20IF**.png?theme=dark&md=1&fontFamily=roboto-condensed&fontSize=100px&images=https%3A%2F%2Fcc-vocabulary.netlify.app%2Flogos%2Fcc%2Flettermark.svg%23lettermark&images=https%3A%2F%2Fpic.onlinewebfonts.com%2Fsvg%2Fimg_452496.png&widths=auto&heights=auto" />

      <title>Seminar IF</title>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp;
