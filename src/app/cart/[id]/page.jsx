import { GetCart, GetCity, GetProvice, ListBank } from '@/controllers/cart';
import FormData from "@/components/formData";
export const dynamic = 'force-dynamic'
import { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth";

BigInt.prototype.toJSON = function () {
    return this.toString();
}

export const metadata = {
    title: 'Halaman Form dan Pembayaran | Pelangi Teknik',
    description: 'Masukkan informasi Anda dan pilih metode pembayaran untuk menyelesaikan pesanan. Proses cepat dan aman untuk pengalaman belanja yang nyaman!',
}

export default async function Page({ params }) {
    const season = await getServerSession(authOptions);

    const [dataProduct, dataBank, dataCity, dataProvinces] = await Promise.all([
        GetCart(params.id),
        ListBank(),
        GetCity(),
        GetProvice()
    ])

    return (
        <FormData
            data={dataProduct}
            dataBank={dataBank}
            idCart={season?.user?.id}
            email={season?.user?.email}
            cities={dataCity}
            provinces={dataProvinces}
        />
    );
}
