import About from "@/components/about";
import Category from "@/components/category";
import Judul from "@/components/judul";
import Rating from "@/components/rating";
import { GetListKategori, GetGoogleMap } from "@/controllers/userNew";
import redis from "@/lib/redis";
import { RedisSatuHari } from "@/utils/RedisSatuHari";

export const metadata = {
    title: "Halaman Tentang dan Portofolio | Pelangi Teknik",
    description:
        "Temukan informasi tentang kami dan lihat portofolio lengkap proyek-proyek kami. Dengan pengalaman dan keahlian yang beragam, kami siap membantu mewujudkan visi Anda.",
};

export default async function Page() {
    try {
        // 🔍 Ambil dari Redis (paralel)
        const [cachedKategori, cachedMap] = await Promise.all([
            redis.get("data:kategori"),
            redis.get("data:googleMap"),
        ]);

        // 🗄️ Ambil dari DB/API jika cache kosong
        const [dataKategori, dataGoogleMap] = await Promise.all([
            cachedKategori ? JSON.parse(cachedKategori) : GetListKategori(),
            cachedMap ? JSON.parse(cachedMap) : GetGoogleMap(),
        ]);

        // 💾 Simpan ulang data baru ke Redis (TTL berbeda)
        await Promise.allSettled([
            redis.set("data:kategori", JSON.stringify(dataKategori), "EX", RedisSatuHari()), // 1 hari
            redis.set("data:googleMap", JSON.stringify(dataGoogleMap), "EX", 604800), // 7 hari
        ]);

        // ✅ Render halaman
        return (
            <>
                <About />
                <Judul judul="Categories" />
                <Category data={dataKategori} />
                <Judul judul="Trusted by brands serious about realtime" />
                <Rating data={dataGoogleMap?.result} />
            </>
        );
    } catch (error) {
        console.error("❌ Error di halaman About/Portfolio:", error);

        // Jika Redis atau API error, fallback tetap jalan
        const [dataKategori, dataGoogleMap] = await Promise.all([
            GetListKategori().catch(() => []),
            GetGoogleMap().catch(() => ({})),
        ]);

        return (
            <>
                <About />
                <Judul judul="Categories" />
                <Category data={dataKategori} />
                <Judul judul="Trusted by brands serious about realtime" />
                <Rating data={dataGoogleMap?.result} />
            </>
        );
    }
}
