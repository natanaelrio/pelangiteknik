import BannerKategori from "@/components/bannerKategori";
import Judul from "@/components/judul";
import Category from "@/components/category";
import { notFound } from "next/navigation";
import { GetKategori, GetKategoriUtama } from "@/controllers/userNew";
import redis from "@/lib/redis";
import { RedisSatuHari } from "@/utils/RedisSatuHari";

export const dynamic = "force-dynamic";

// 🧠 Generate metadata dengan Redis
export async function generateMetadata({ params }) {
    const cacheKey = `kategoriParentMeta:${params.slug}`;

    // 🔍 Ambil dari cache Redis
    const cached = await redis.get(cacheKey);

    const kategoriChildren = cached
        ? JSON.parse(cached)
        : await (async () => {
            console.log("⚙️ Metadata fetched from DB:", cacheKey);
            const fresh = await GetKategoriUtama(params.slug);

            // ✅ Simpan hanya jika data valid
            if (fresh?.data?.id) {
                await redis.set(cacheKey, JSON.stringify(fresh), "EX", RedisSatuHari()); // TTL 1 hari
            }

            return fresh;
        })();

    return {
        title: kategoriChildren?.data[0]?.id
            ? `Jual ${kategoriChildren.data[0].category} - Hubungi Kami - Pelangi Teknik`
            : `Distibutor Genset Murah - Hubungi Kami - Pelangi Teknik`,
        description:
            kategoriChildren?.data?.desc ||
            `Temukan produk kategori ${kategoriChildren.data[0].category} di Pelangi Teknik.`,
    };
}

// 🧩 Halaman utama kategori
export default async function Page({ params }) {
    const cacheKey = `kategoriParent:${params.slug}`;

    // 🔍 Ambil data dari Redis jika ada
    const cached = await redis.get(cacheKey);

    const kategoriChildren = cached
        ? JSON.parse(cached)
        : await (async () => {
            console.log("⚙️ Data kategori fetched from DB:", cacheKey);
            const fresh = await GetKategoriUtama(params.slug);

            // ✅ Simpan hanya jika data valid
            if (fresh?.data?.length) {
                await redis.set(cacheKey, JSON.stringify(fresh), "EX", RedisSatuHari()); // TTL 1 hari
            }

            return fresh;
        })();

    // 🚫 Jika data kosong → notFound
    if (!kategoriChildren?.data?.length) return notFound();

    const kategori = kategoriChildren.data[0];

    return (
        <div>
            <BannerKategori data={kategori} />
            <Judul judul={kategori.category} />
            <Category data={kategori.categoryProduct} kondisi={true} />
        </div>
    );
}
