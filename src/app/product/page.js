import ListProductUser from "@/components/listProductUser";
import { GetSearchServerElasticSearch } from "@/controllers/userNewC";
import { UnslugifyMerek } from "@/utils/unSlugifyMerek";
export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'Distributor Genset Murah | Pelangi Teknik',
    description: 'Temukan berbagai pilihan genset berkualitas untuk kebutuhan industri, komersial, dan rumah tangga. Mulai dari genset portable hingga kapasitas besar, hemat bahan bakar, dan tahan lama. Lihat selengkapnya sekarang!',
}

export default async function Page({ params, searchParams }) {
    const q = searchParams.q || '';
    const t = Number(searchParams.t) || 1;
    const m = UnslugifyMerek(searchParams.m);

    const normalize = s => s?.replace(/^\s+/, '') || "";
    const normalizedQuery = normalize(q);
    let res = [];
    try {
        const data = await GetSearchServerElasticSearch(t, 7, m, q);
        res = data || [];
    } catch (err) {
        console.error(err);
    }
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