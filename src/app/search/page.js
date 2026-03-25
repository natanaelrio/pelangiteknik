import { GetSearchServerElasticSearch } from "@/controllers/userNew";
import ListProductUser from "@/components/listProductUser";
import { Unslugify } from "@/utils/unSlugify";
import { UnslugifyMerek } from "@/utils/unSlugifyMerek";
import NotFoundSearch from "@/components/notFoundSearch";
import { GetSearchRedis } from "@/controllers/redis";

export async function generateMetadata({ params, searchParams }, parent) {
    const q = searchParams.q;
    const m = searchParams.m;
    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/search?q=${q}`;

    const date = new Date();
    const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    const currentMonth = months[date.getMonth()];
    const currentYear = date.getFullYear();

    const title = `Jual ${Unslugify(q)}${m ? ' ' + Unslugify(m) : ''} - Kualitas Terbaik, Harga Spesial ${currentMonth} ${currentYear} & Garansi Resmi - Pelangi Teknik`
    const description = `Temukan berbagai pilihan ${Unslugify(q)} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`

    return {
        title,
        description,
        alternates: { canonical: canonicalUrl },
    };
}

export default async function Page({ params, searchParams }) {
    const q = searchParams.q;
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m);
    const ListSearch = await GetSearchRedis()

    const res = await GetSearchServerElasticSearch(t, 7, m, q);

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
                    <meta property="og:image" content={image} />
                    <meta property="og:title" content={title} />
                    <meta property="og:description" content={description} />
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