import Header from "./components/Header";
import "./globals.css";

// export const metadata = {
//   icons: {
//     icon: '/assets/icons/favicon-128.png',
//     apple: '/assets/icons/apple-touch-icon-144x144.png',
//   },
//   openGraph: {
//     title: 'Seminar IF Unmul',
//     description: 'Website Seminar IF Unmul',
//     url: 'seminar.dalamkotak.com',
//     sitename: 'SeminarIF',
//     type: 'website',
//     authors: ['Oktavian'],
//     images: [
//       {
//         url: '/assets/icons/icon-72x72.png',
//         width: 72,
//         height: 72,
//       },
//       {
//         url: '/assets/icons/icon-96x96.png',
//         width: 96,
//         height: 96,
//       },
//       {
//         url: '/assets/icons/icon-128x128.png',
//         width: 128,
//         height: 128,
//       },
//       {
//         url: '/assets/icons/icon-144x144.png',
//         width: 144,
//         height: 144,
//       },
//       {
//         url: '/assets/icons/icon-152x152.png',
//         width: 152,
//         height: 152,
//       },
//       {
//         url: '/assets/icons/icon-192x192.png',
//         width: 192,
//         height: 192,
//       },
//       {
//         url: '/assets/icons/icon-384x384.png',
//         width: 384,
//         height: 384,
//       },
//       {
//         url: '/assets/icons/icon-512x512.png',
//         width: 512,
//         height: 512,
//       },
//     ]
//   }
// }

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head />
      <body className="container mx-auto mt-10">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
