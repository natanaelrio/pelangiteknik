import PrivacyPolicy from "@/components/privacy-policy"

export const metadata = {
    title: 'Kebijakan Privasi',
    description: 'Masuk ke akun Anda untuk mengelola preferensi, mengakses data, dan menggunakan layanan personal Anda.',
}


export default async function Page() {
    return (
        <PrivacyPolicy />
    )
}
