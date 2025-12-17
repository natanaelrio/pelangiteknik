import ListArtikel from "@/components/artikel/listArtikel";
import { GetListArtikel } from "@/controllers/artikel";
import { GetListKategori } from "@/controllers/userNew";

export const metadata = {
    title: 'Berita dan Informasi Peralatan Mesin | Pelangi Teknik',
    description: 'Temukan artikel, tips, dan informasi terbaru seputar genset, instalasi listrik, serta solusi teknis bersama Pelangi Teknik.',
}

export default async function Page() {
    const [dataKategori, dataArtikel] = await Promise.all([
        GetListKategori(),
        GetListArtikel()
    ])
    return (
        < >
            <ListArtikel data={dataArtikel.data} />
        </>
    );
}
