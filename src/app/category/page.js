import Judul from "@/components/judul";
import ProductHeaderMelayang from "@/components/productHeaderMelayang";
import redis from "@/lib/redis";

export default async function Page() {
    let dataKategori = null;

    try {
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
        <>
            <Judul judul="Kategori Produk" />
            <ProductHeaderMelayang data={dataKategori || []} />
        </>
    )
}
