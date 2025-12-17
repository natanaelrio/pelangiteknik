import DetailArtikel from "@/components/artikel/detailArtikel";
import { HandleDetailArtikel } from "@/controllers/artikel";
import redis from "@/lib/redis";
import ProductSchemaArticle from "@/utils/ProductSchemaArticle";
import { notFound } from "next/navigation";

export const dynamic = 'force-dynamic'
export async function generateMetadata({ params, searchParams }, parent) {
    // read route params
    const id = params.slug

    const cacheKey = `blogMeta:${id}`;

    // 🔍 Ambil dari Redis jika ada
    let blog = await redis.get(cacheKey);
    if (blog) {
        console.log("🧠 Metadata from Redis:", cacheKey);
        blog = JSON.parse(blog);
    } else {
        console.log("⚙️ Metadata fetched from DB:", cacheKey);
        const fresh = await HandleDetailArtikel(id);

        // 💾 Simpan ke Redis hanya jika datanya valid
        if (fresh && fresh?.data?.id) {
            await redis.set(cacheKey, JSON.stringify(fresh)); // TTL 1 hari
        }

        blog = fresh;
    }

    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/blog/${id}`
    // fetch data
    const artikel = await HandleDetailArtikel(id)

    return {
        title: artikel?.data?.title + " - " + 'PelangiTeknik',
        description: artikel?.data?.description,
        openGraph: {
            images: [artikel?.data?.imageProductArtikel[0]?.secure_url
                || `${process.env.NEXT_PUBLIC_URL}/1.jpg}`],
        },
        keywords: artikel?.data?.tagsArtikel?.map((tag) => (
            tag?.name
        )),
        alternates: {
            canonical: canonicalUrl,
        }
    }

}

export default async function Page({ params }) {
    // 🔍 Ambil cache dari Redis
    const [cachedProduct] = await Promise.all([
        redis.get(`blog: ${params.slug}`)
    ]);

    // 🗄️ Ambil data asli jika cache kosong
    const [dataArtikel] = await Promise.all([
        cachedProduct ? JSON.parse(cachedProduct) : HandleDetailArtikel(params.slug)
    ]);

    // 💾 Simpan ulang ke Redis hanya jika datanya valid
    await Promise.all([
        dataArtikel?.data?.id
            ? redis.set(`blog:${params.slug}`, JSON.stringify(dataArtikel)) // 1 hari
            : Promise.resolve()
    ]);


    return (
        dataArtikel?.data?.id ?
            <>
                <head>
                    <ProductSchemaArticle data={dataArtikel?.data} />
                </head>
                <DetailArtikel data={dataArtikel?.data} />
            </>
            : notFound()
    );
}
