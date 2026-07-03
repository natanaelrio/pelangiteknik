import PromoPolicy from "@/components/policies/promo-policy"
export const metadata = {
    title: 'Kebijakan Promo',
    description: 'Masuk ke akun Anda untuk mengelola preferensi, mengakses data, dan menggunakan layanan personal Anda.',
}


export default async function Page() {
    return (
        <PromoPolicy />
    )
}
