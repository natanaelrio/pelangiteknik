import { Inter } from "next/font/google";
import 'react-loading-skeleton/dist/skeleton.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Provider from "@/lib/provider";
import HeaderFooter from "@/components/layout/headerFooter";
import redis from "@/lib/redis";
import { GetDataPesanan, GetListKategori } from "@/controllers/userNew"; // ✅ Tambahkan import ini
import { RedisSatuHari } from "@/utils/RedisSatuHari";
import { GetSearchRedis } from "@/controllers/redis";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  // title: "Pelangi Teknik Indonesia",
  // description: "Pelangi Teknik Indonesia",
  verification: {
    google: "Ox3ZUbaizkQC5onzknoa0XtYTvmj6rRFGhNs__Lq2gE",
  }
  // ,
  // icons: {
  //   icon: '/favicon.ico',
  // },
};

export default async function RootLayout({ children }) {

  // const pathName = typeof window !== "undefined" ? window.location.pathname : "";
  let dataKategori = [];
  let dataPesanan = [];
  let ListSearch = await GetSearchRedis();

  try {

    // 🔍 ambil cache kategori
    const cachedKategori = await redis.get("data:kategori");
    const cachedPesanan = await redis.get("data:pesanan");

    if (cachedKategori) {
      dataKategori = JSON.parse(cachedKategori);
    } else {
      const freshKategori = await GetListKategori();

      if (freshKategori && Array.isArray(freshKategori) && freshKategori.length > 0) {
        await redis.set(
          "data:kategori",
          JSON.stringify(freshKategori),
          "EX",
          RedisSatuHari()
        );
      }

      dataKategori = freshKategori || [];
    }

    // 🔍 ambil cache pesanan
    if (cachedPesanan) {
      dataPesanan = JSON.parse(cachedPesanan);
    } else {
      const freshDataPesanan = await GetDataPesanan();

      if (freshDataPesanan && Array.isArray(freshDataPesanan)) {
        await redis.set(
          "data:pesanan",
          JSON.stringify(freshDataPesanan),
          "EX",
          RedisSatuHari()
        );
      }

      dataPesanan = freshDataPesanan || [];
    }

  } catch (error) {
    console.error("⚠️ Redis or API error:", error);

    dataKategori = [];
    dataPesanan = [];
  }

  return (
    <html lang="en">
      {/* <head>
        <script
          src="https://accounts.google.com/gsi/client"
          async
          defer
        ></script>
      </head> */}
      <head>
        <link rel="icon" href="/favicon2.ico" />
      </head>
      <GoogleTagManager gtmId="GTM-N8N4T4Z8" />
      {/* <GoogleTagManager gtmId="AW-17593657597" /> */}
      <body className={inter.className}>
        <GoogleAnalytics gaId="G-X9V8WXZW3L" />
        {/* 📊 Analytics & Tag Manager */}
        {/* <GoogleTagManager gtmId="GTM-MB2V66M2" /> */}

        {/* ⚙️ UI Utilities */}
        <Toaster position="bottom-left" />
        <NextTopLoader
          color="#2299DD"
          height={1}
          crawl
          showSpinner={false}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          zIndex={1600}
        />

        {/* 🧱 Layout utama */}
        <Provider>
          <HeaderFooter
            dataPesanan={dataPesanan || []}
            data={dataKategori || []}
            ListSearch={ListSearch}
            tombolwa={true}>
            {children}
          </HeaderFooter>
        </Provider>
      </body>
    </html>
  );
}
