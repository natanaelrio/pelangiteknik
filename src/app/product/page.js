import ListProductUser from "@/components/listProductUser";
import redis from "@/lib/redis";
import { GetSearchServer } from "@/controllers/userNew";
import { RedisSatuHari } from "@/utils/RedisSatuHari";
import { UnslugifyMerek } from "@/utils/unSlugifyMerek";
export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Distributor Genset Murah | Pelangi Teknik',
    description: 'Temukan berbagai pilihan genset berkualitas untuk kebutuhan industri, komersial, dan rumah tangga. Mulai dari genset portable hingga kapasitas besar, hemat bahan bakar, dan tahan lama. Lihat selengkapnya sekarang!',
}

export default async function Page({ params, searchParams }) {
    const q = '';
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m);

    const normalize = s => s?.replace(/^\s+/, '') || "";
    const normalizedQuery = normalize(q);
    const cacheKey = `search:${normalizedQuery}:m:${m || 'All'}:t:${t || 1}`;

    const cached = await redis.get(cacheKey);
    const res = cached
        ? JSON.parse(cached)
        : await (async () => {
            const fresh = await GetSearchServer(t, 7, m, q);
            await redis.set(cacheKey, JSON.stringify(fresh), "EX", RedisSatuHari()); // TTL 1 hari
            return fresh;
        })();


    return (
        <ListProductUser
            res={res}
            q={q}
            m={m}
            t={t}
            kataKunci={normalizedQuery}
            Lfilter={true}
        />
    );
}