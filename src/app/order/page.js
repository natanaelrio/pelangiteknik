import DataPesanan from "@/components/user/dataPesanan";
import { GetDataPesanan } from "@/controllers/cart";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic'

export const metadata = {
    title: 'List Daftar Pesanan | Pelangi Teknik',
    description: 'Periksa dan kelola pesanan Anda di sini. Lacak status order, riwayat pembelian, dan detail pengiriman dengan mudah.',
}

export default async function Page() {
    const season = await getServerSession(authOptions);

    const [dataPesanan] = await Promise.all([
        GetDataPesanan(season?.user?.id)
    ])

    return (
        <DataPesanan data={dataPesanan} season={season} />
    )
}
