import DeliveryPolicy from "@/components/policies/deliveryPolicy";

export const metadata = {
    title: 'Kebijakan Pengiriman (Delivery Policy)',
    description: 'Masuk ke akun Anda untuk mengelola preferensi, mengakses data, dan menggunakan layanan personal Anda.',
}

export default async function Page() {

    return (
            <DeliveryPolicy />
    )
}
