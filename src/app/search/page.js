import { GetSearchServer, GetSearchServerElasticSearch } from "@/controllers/userNew";
import ListProductUser from "@/components/listProductUser";
import redis from "@/lib/redis";
import { RedisSatuHari } from "@/utils/RedisSatuHari";
import { Unslugify } from "@/utils/unSlugify";
import { UnslugifyMerek } from "@/utils/unSlugifyMerek";
import NotFoundSearch from "@/components/notFoundSearch";
export const dynamic = 'force-dynamic'

export async function generateMetadata({ params, searchParams }, parent) {
    const q = searchParams.q;
    const t = Number(searchParams.t) || 1;
    const m = searchParams.m;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/search?q=${q}`;

    const aw = await GetSearchServerElasticSearch(t, 7, m, q);

    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const images = aw?.data.data
        ?.map((item) => item?.imageProductUtama?.secure_url || item?.imageProductUtama)
        ?.filter(Boolean) || [];

    const title = `Jual ${Unslugify(q)}${m ? ' ' + Unslugify(m) : ''} - Kualitas Terbaik, Harga Spesial ${currentMonth} ${currentYear} & Garansi Resmi - Pelangi Teknik`;
    const description = `Temukan berbagai pilihan ${Unslugify(q)} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`;

    return {
        title,
        description,
        openGraph: {
            images: images.length
                ? images.map((url) => ({
                    url,
                    width: 1200,
                    height: 630,
                    alt: `Jual ${Unslugify(q)} - Harga Spesial ${currentMonth} ${currentYear} - Pelangi Teknik`,
                }))
                : [
                    {
                        url: "https://pelangiteknik.com/default-og.jpg", // fallback gambar default
                        width: 1200,
                        height: 630,
                        alt: "Pelangi Teknik - Toko Resmi Genset & Peralatan Teknik",
                    },
                ],
        },
        alternates: { canonical: canonicalUrl },
    };
}

export default async function Page({ params, searchParams }) {
    const q = Unslugify(searchParams.q);
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m);

    const res = await GetSearchServerElasticSearch(t, 7, m, q);

    console.log(res);

    res?.data?.data?.length && await redis
        .multi()
        .zadd("search:index", Date.now(), q)
        .expire("search:index", RedisSatuHari())
        .exec();

    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const image = res?.data?.data?.map((item) => item?.imageProductUtama)
    const title = `Jual ${q}${m ? ' ' + m : ''} - Kualitas Terbaik, Harga Spesial ${currentMonth} ${currentYear} & Garansi Resmi - Pelangi Teknik`;
    const description = `Temukan berbagai pilihan ${q} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`;

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
                                "name": title,
                                "image": image,
                                "description": description,

                                // // ⭐⭐⭐⭐⭐ Rating Bintang 5
                                // "aggregateRating": {
                                //     "@type": "AggregateRating",
                                //     "ratingValue": "5",
                                //     "reviewCount": String(res?.totalMaxProduct || 17),  // wajib ada, minimal 1
                                // },
                            }),
                        }}
                    />
                </head>
                <ListProductUser
                    res={res}
                    q={q}
                    m={m}
                    t={t}
                    kataKunci={q}
                    Lfilter={true}
                />
            </>
            : <NotFoundSearch q={q} />
    );
}