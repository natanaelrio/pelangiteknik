import ListProductUser from "@/components/listProductUser";

export const dynamic = 'force-dynamic'
import { GetFilterProduct } from "@/controllers/userNew";

export const metadata = {
    title: 'Distributor Genset Murah | Pelangi Teknik',
    description: 'Temukan berbagai pilihan genset berkualitas untuk kebutuhan industri, komersial, dan rumah tangga. Mulai dari genset portable hingga kapasitas besar, hemat bahan bakar, dan tahan lama. Lihat selengkapnya sekarang!',
}

export default async function Page() {
    const [dataFillter] = await Promise.all([
        GetFilterProduct()
    ])

    return (
        <>
            <ListProductUser
                Fillter={dataFillter}
                Lfilter={true}
                countFilter={true}
            />
        </>
    );
}
