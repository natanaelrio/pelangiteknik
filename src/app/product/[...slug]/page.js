import Product from "@/components/product";
import ListProduct from "@/components/listProduct";
import Judul from "@/components/judul";
import Rating from "@/components/rating";
import { GetProduct, GetProductBestProduct, GetListKategori, GetGoogleMap } from "@/controllers/userNew";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import redis from "@/lib/redis";
import { notFound } from "next/navigation";
import { RedisSatuHari } from "@/utils/RedisSatuHari";
import ProductSchema from "@/utils/ProductSchemaProduct";

export const dynamic = "force-dynamic";

BigInt.prototype.toJSON = function () {
    return this.toString();
};

// 🧠 Metadata dengan Redis Cache
export async function generateMetadata({ params }) {
    const id = params.slug;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/product/${id}`;
    const cacheKey = `product:${id}`;

    // 🔍 Ambil dari Redis jika ada
    let productData = await redis.get(cacheKey);
    if (productData) {
        console.log("🧠 Metadata from Redis:", cacheKey);
        productData = JSON.parse(productData);
    } else {
        console.log("⚙️ Metadata fetched from DB:", cacheKey);
        const fresh = await GetProduct(id);

        // 💾 Simpan ke Redis hanya jika datanya valid
        if (fresh && fresh.length > 0) {
            await redis.set(cacheKey, JSON.stringify(fresh)); // TTL Selamanya
        }

        productData = fresh;
    }

    // 🗓️ Format tanggal (bulan + tahun)
    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    return {
        title: `${productData[0]?.productName || "Distributor Genset - Hubungi Kami"} - PelangiTeknik`,
        description: `${productData[0]?.descMetaProduct || "Informasi produk tidak tersedia."} - ${currentMonth} ${currentYear} - PelangiTeknik`,
        openGraph: {
            images: productData[0]?.imageProductUtama?.secure_url
                ? [
                    {
                        url: productData[0].imageProductUtama.secure_url,
                        width: 1200,
                        height: 630,
                        alt: `${productData[0]?.productName} - ${currentMonth} ${currentYear} - PelangiTeknik`,
                    },
                ]
                : [],
        },
        keywords: productData[0]?.tagProduct?.split(", "),
        alternates: { canonical: canonicalUrl },
    };
}

export default async function Page({ params }) {
    const session = await getServerSession(authOptions);
    const slug = params.slug;

    // 🔍 Ambil cache dari Redis
    const [cachedProduct, cachedBest, cachedKategori, cachedMap] = await Promise.all([
        redis.get(`product:${slug}`),
        redis.get("data:productBest"),
        redis.get("data:kategori"),
        redis.get("data:googleMap"),
    ]);

    // 🗄️ Ambil data asli jika cache kosong
    const [dataProduct, dataListProduct, dataListKategori, dataGoogleMap] = await Promise.all([
        cachedProduct ? JSON.parse(cachedProduct) : GetProduct(slug),
        cachedBest ? JSON.parse(cachedBest) : GetProductBestProduct(),
        cachedKategori ? JSON.parse(cachedKategori) : GetListKategori(),
        cachedMap ? JSON.parse(cachedMap) : GetGoogleMap(),
    ]);

    // 💾 Simpan ulang ke Redis hanya jika datanya valid
    await Promise.all([
        dataProduct?.length > 0
            ? redis.set(`product:${slug}`, JSON.stringify(dataProduct)) // Selamanya
            : Promise.resolve(),

        dataListProduct?.length > 0
            ? redis.set("data:productBest", JSON.stringify(dataListProduct), "EX", 604800) // 7 hari
            : Promise.resolve(),

        dataListKategori?.length > 0
            ? redis.set("data:kategori", JSON.stringify(dataListKategori), "EX", RedisSatuHari()) // 1 hari
            : Promise.resolve(),

        dataGoogleMap
            ? redis.set("data:googleMap", JSON.stringify(dataGoogleMap), "EX", 604800) // 7 hari
            : Promise.resolve(),
    ]);

    // ✅ Render halaman
    return (
        dataProduct?.length > 0 ?
            <>
                <head>
                    <ProductSchema data={dataProduct} />
                </head>
                <Product data={dataProduct[0]} season={session} />

                <Judul judul="Best Product" />
                <ListProduct Listdata={dataListProduct} Lfilter={false} />

                <Judul judul="Trusted by brands serious about realtime" />
                <Rating data={dataGoogleMap?.result} />
            </> :
            notFound()
    );
}
