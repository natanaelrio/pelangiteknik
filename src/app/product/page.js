import ListProductUser from "@/components/listProductUser";
import redis from "@/lib/redis";
import { GetSearchServer, GetSearchServerElasticSearch } from "@/controllers/userNew";
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
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/elasticSearch/elasticSearchUser?page=${t}&limit=${7}&m=${m ? m : 'undefined'}&query=${q ? q : ''}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
        },
        next: {
            revalidate: 0
        }
    });
    const data = await res.json()

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