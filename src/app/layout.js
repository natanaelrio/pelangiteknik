import { Inter } from "next/font/google";
import 'react-loading-skeleton/dist/skeleton.css';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "react-hot-toast";
import Provider from "@/lib/provider";
import HeaderFooter from "@/components/layout/headerFooter";
import redis from "@/lib/redis";
import { GetListKategori } from "@/controllers/userNew"; // ✅ Tambahkan import ini
import { RedisSatuHari } from "@/utils/RedisSatuHari";
import { GetSearchRedis } from "@/controllers/redis";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Pelangi Teknik Indonesia",
  description: "Pelangi Teknik Indonesia",
  verification: {
    google: "Ox3ZUbaizkQC5onzknoa0XtYTvmj6rRFGhNs__Lq2gE",
  }
  // ,
  // icons: {
  //   icon: '/favicon.ico',
  // },
};

export default async function RootLayout({ children }) {
  let dataKategori = null;
  let ListSearch = await GetSearchRedis()

  try {

    // const ListSearchtry = await redis.zrevrange("search:index", 0, 10);
    // ListSearch = ListSearchtry

    // 🔍 Coba ambil dari Redis
    const cached = await redis.get("data:kategori");

    if (cached) {
      dataKategori = JSON.parse(cached);
    } else {
      // 🗄️ Ambil dari API jika cache kosong
      const fresh = await GetListKategori();

      // ✅ Simpan hanya jika data valid
      if (fresh && Array.isArray(fresh) && fresh.length > 0) {
        await redis.set("data:kategori", JSON.stringify(fresh), "EX", RedisSatuHari()); // TTL 1 hari
      }

      dataKategori = fresh;
    }
  } catch (error) {
    console.error("⚠️ Redis or GetListKategori error:", error);
    // fallback kosong biar tidak crash
    dataKategori = [];
    // ListSearch = []
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
        <Toaster />
        <NextTopLoader
          color="#2299DD"
          height={3}
          crawl
          showSpinner={false}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
          zIndex={1600}
        />

        {/* 🧱 Layout utama */}
        <Provider>
          <HeaderFooter data={dataKategori || []} ListSearch={ListSearch} tombolwa={true}>
            {children}
          </HeaderFooter>
        </Provider>
      </body>
    </html>
  );
}
