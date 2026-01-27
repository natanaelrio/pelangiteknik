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

export default async function Page({ searchParams }) {
    const q = searchParams.q || '';
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m || '');

    const normalizedQuery = q.trim();

    const url = `${process.env.NEXT_PUBLIC_URL}/api/elasticSearch/elasticSearchUser?page=${t}&limit=7&m=${encodeURIComponent(m || 'undefined')}&query=${encodeURIComponent(q)}`;

    let data = [];
    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.NEXT_PUBLIC_SECREET || ''
            },
            next: { revalidate: 0 }
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        data = await res.json();
    } catch (err) {
        console.error('Fetch error:', err);
    }

    return (
        <ListProductUser
            res={data}
            q={q}
            m={m}
            t={t}
            kataKunci={normalizedQuery}
            Lfilter={true}
        />
    );
}