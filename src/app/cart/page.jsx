import Carts from "@/components/user/cart"
import { GetCart } from "@/controllers/cart";
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";

export const metadata = {
    title: 'Halaman Keranjang | Pelangi Teknik',
    description: 'Periksa item yang telah Anda pilih sebelum checkout. Sesuaikan jumlah, hapus barang, dan lanjutkan belanja dengan mudah!',
}

export const dynamic = 'force-dynamic'

export default async function Page() {
    const season = await getServerSession(authOptions);

    const [dataCart] = await Promise.all([
        GetCart(season?.user?.id),
    ])

    return (
        <Carts data={dataCart} />
    )
}
