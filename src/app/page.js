import Category from "@/components/category";
import Hpo from "@/components/hpo";
import Judul from "@/components/judul";
import ListProduct from "@/components/listProduct";
import { GetListKategori, GetProductBestProduct, GetListProduct, GetGoogleMap, GetSumView } from "@/controllers/userNew";
import Rating from "@/components/rating";
import Banner from "@/components/Banner";
import redis from "@/lib/redis";
import { RedisSatuHari } from "@/utils/RedisSatuHari";

export const metadata = {
  title: "Pelangi Teknik | Pusat Pembelian Peralatan Genset NO 1",
  description:
    "Temukan berbagai pilihan genset berkualitas untuk kebutuhan industri, komersial, dan rumah tangga. Dapatkan harga terbaik dan layanan profesional sekarang juga!",
};

export const dynamic = "force-dynamic";

export default async function Home() {

  // 🔍 Ambil semua data dari Redis (jika ada)
  const [cachedKategori, cachedBest, cachedList, cachedMap] = await Promise.all([
    redis.get("data:kategori"),
    redis.get("data:productBest"),
    redis.get("data:productList"),
    redis.get("data:googleMap"),
  ]);

  // 🗄️ Ambil dari DB/API jika cache kosong
  const [dataKategori, dataListProductBest, dataListProduct, dataGoogleMap, dataSumView] = await Promise.all([
    cachedKategori ? JSON.parse(cachedKategori) : GetListKategori(),
    cachedBest ? JSON.parse(cachedBest) : GetProductBestProduct(),
    cachedList ? JSON.parse(cachedList) : GetListProduct(1, 9),
    cachedMap ? JSON.parse(cachedMap) : GetGoogleMap(),
    GetSumView(), // ⚠️ tidak pakai Redis
  ]);

  // 💾 Simpan ulang data baru ke Redis sesuai TTL masing-masing
  await Promise.all([
    redis.set("data:kategori", JSON.stringify(dataKategori), "EX", RedisSatuHari()), // 7 hari = 604800 detik
    redis.set("data:productBest", JSON.stringify(dataListProductBest), "EX", RedisSatuHari()), // 7 hari
    redis.set("data:productList", JSON.stringify(dataListProduct), "EX", 3600), // 1 jam = 3600 detik
    redis.set("data:googleMap", JSON.stringify(dataGoogleMap), "EX", 604800), // 7 hari
  ]);

  // ✅ Render komponen


  return (
    <>
      {/* <BannerMain data={dataKategori} /> */}
      <Banner data={dataKategori} sumView={dataSumView?._sum?.viewProduct ?? 0} />
      <Hpo />

      <Judul judul="Best Product" />
      <ListProduct Listdata={dataListProductBest} Lfilter={false} angka={true} />

      <Judul judul="List Product" />
      <ListProduct
        Listdata={dataListProduct?.data}
        Lfilter={false}
        loadmore={true}
      />

      <Judul judul="Categories" />
      <Category data={dataKategori} />

      <Judul judul="Trusted by brands serious about realtime" />
      <Rating data={dataGoogleMap?.result} />
    </>
  );
}
