import BannerKategori from "@/components/bannerKategori";
import ListProductUser from "@/components/listProductUser";
import { notFound } from "next/navigation";
import { GetKategori } from "@/controllers/userNew";
import redis from "@/lib/redis";
import { RedisSatuHari } from "@/utils/RedisSatuHari";

export const dynamic = "force-dynamic";

// 🔧 Format teks slug jadi kapital tiap kata
function formatText(text) {
    return text
        .replace(/-/g, " ")
        .replace(/\b(\w)/g, (match) => match.toUpperCase());
}

// 🧠 Generate Metadata pakai Redis
export async function generateMetadata({ params, searchParams }) {
    const t = Number(searchParams.t) || 1;
    const cacheKey = `kategoriChildrenMeta:products:${params.slugg}:t:${t || 1}`;

    // 🔍 Ambil cache dari Redis
    const cached = await redis.get(cacheKey);

    // 🔄 Jika tidak ada cache, ambil dari DB
    const dataKategori = cached
        ? JSON.parse(cached)
        : await (async () => {
            const freshData = await GetKategori(1, 1, params.slugg, "undefined");

            // ✅ Simpan hanya jika data valid
            if (freshData?.data?.id) {
                await redis.set(cacheKey, JSON.stringify(freshData), "EX", RedisSatuHari()); // 1 hari
            }

            return freshData;
        })();

    const namaKategori = formatText(params.slugg);

    return {
        title: dataKategori?.data?.id
            ? `Jual ${namaKategori} - Hubungi Kami - Pelangi Teknik`
            : `Distibutor Genset Murah - Hubungi Kami - Pelangi Teknik`,
        description:
            dataKategori?.data?.desc ??
            `Temukan produk kategori ${namaKategori} di Pelangi Teknik.`,
    };
}

// 🧱 Halaman utama
export default async function Page({ params, searchParams }) {
    const t = Number(searchParams.t) || 1;
    const cacheKeyKategori = `kategoriChildren:${params.slugg}`;
    const cacheKeyProducts = `kategoriChildren:products:${params.slugg}:t:${t || 1}`;

    // 🔍 Ambil data kategori dari Redis
    const cachedKategori = await redis.get(cacheKeyKategori);
    const dataKategori = cachedKategori
        ? JSON.parse(cachedKategori)
        : await (async () => {
            const freshData = await GetKategori(1, 1, params.slugg, "undefined");
            if (freshData?.data?.id) {
                await redis.set(cacheKeyKategori, JSON.stringify(freshData), "EX", RedisSatuHari());
            }
            return freshData;
        })();

    // 🔍 Ambil data produk dari Redis
    const cachedProducts = await redis.get(cacheKeyProducts);
    const res = cachedProducts
        ? JSON.parse(cachedProducts)
        : await (async () => {
            const freshProducts = await GetKategori(t, 7, params.slugg);
            if (freshProducts?.data?.length) {
                await redis.set(cacheKeyProducts, JSON.stringify(freshProducts), "EX", RedisSatuHari());
            }
            return freshProducts;
        })();

    // ✅ Render halaman
    return dataKategori?.data?.id ? (
        <>
            <BannerKategori data={dataKategori.data} />
            <ListProductUser
                res={res}
                t={t}
                Lfilter={false}
            />
        </>
    ) : (
        notFound()
    );
}

