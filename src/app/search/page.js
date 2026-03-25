import { GetSearchServerElasticSearch } from "@/controllers/userNew";
import ListProductUser from "@/components/listProductUser";
import { Unslugify } from "@/utils/unSlugify";
import { UnslugifyMerek } from "@/utils/unSlugifyMerek";
import NotFoundSearch from "@/components/notFoundSearch";
import { GetSearchRedis } from "@/controllers/redis";
import { cache } from "react";

// ✅ cache biar tidak double fetch
const getSearchCached = cache(async (t, limit, m, q) => {
    return await GetSearchServerElasticSearch(t, limit, m, q);
});

export async function generateMetadata({ searchParams }) {
    const q = searchParams.q;
    const m = searchParams.m;

    const mUnslug = UnslugifyMerek(m);

    const res = await getSearchCached(1, 1, mUnslug, q);

    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const keyword = Unslugify(res?.suggest?.[0] || q);

    const title = `Jual ${keyword}${mUnslug ? ' ' + mUnslug : ''} - Kualitas Terbaik, Harga Spesial ${currentMonth} ${currentYear} & Garansi Resmi - Pelangi Teknik`;

    const description = `Temukan berbagai pilihan ${keyword} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`;

    const rawImage = res?.data?.data?.[0]?.imageProductUtama;
    const image = rawImage
        ? `${rawImage}`
        : `${process.env.NEXT_PUBLIC_URL}/logo2026.png`;

    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/search?q=${q}`;

    return {
        title,
        description,

        // ✅ canonical
        alternates: {
            canonical: canonicalUrl,
        },

        // ✅ Open Graph
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: "website",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },

        // ✅ Twitter Card
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

export default async function Page({ params, searchParams }) {
    const q = searchParams.q;
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m);
    const ListSearch = await GetSearchRedis()

    // const res = await GetSearchServerElasticSearch(t, 7, m, q);
    // ✅ pakai cache yang sama → tidak fetch ulang
    const res = await getSearchCached(t, 7, m, q);


    // res?.data?.data?.length && await redis
    //     .multi()
    //     .zadd("search:index", Date.now(), Unslugify(q))
    //     .expire("search:index", RedisSatuHari())
    //     .exec();

    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const image = res?.data?.data?.map((item) => item?.imageProductUtama)
    const title = `Jual ${Unslugify(res?.suggest[0] ? res?.suggest[0] : q)}${m ? ' ' + m : ''} - Kualitas Terbaik, Harga Spesial ${currentMonth} ${currentYear} & Garansi Resmi - Pelangi Teknik`;
    const description = `Temukan berbagai pilihan ${Unslugify(res?.suggest[0] ? res?.suggest[0] : q)} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`;

    return (
        res?.data?.data?.length ?
            <>
                <head>
                    <script
                        id="product-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                "@context": "https://schema.org",
                                "@type": "Product",
                                "title": title,
                                "name": title,
                                "image": image,
                                "description": description,

                                // // ⭐⭐⭐⭐⭐ Rating Bintang 5
                                // "aggregateRating": {
                                //     "@type": "AggregateRating",
                                //     "ratingValue": "5",
                                //     "reviewCount": String(res?.totalMaxProduct || 17),  // wajib ada, minimal 1
                                // },
                                // "offers": {
                                //     "@type": "Offer",
                                //     "priceCurrency": "IDR",
                                //     "price": String(res.data.data[0].productPrice),
                                //     "availability": "https://schema.org/InStock",
                                //     "url": canonicalUrl
                                // }
                            }),
                        }}
                    />
                </head>
                <ListProductUser
                    res={res || []}
                    q={q}
                    m={m}
                    t={t}
                    kataKunci={q}
                    Lfilter={true}
                />
            </>
            : <NotFoundSearch
                q={q}
                suggest={res?.suggest}
                ListSearch={ListSearch} />
    );
}