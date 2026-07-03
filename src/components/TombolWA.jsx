import { useStore } from '@/zustand/zustand'
import styles from '@/components/tombolWA.module.css'
import Image from 'next/image'
import HandleKonversiWA from '@/utils/HandleKonversiWA'
import { usePathname, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function TombolWA() {
    const setIsLoadingWA = useStore((state) => state.setIsLoadingWA)
    const isLoadingWA = useStore((state) => state.isLoadingWA)

    const pathName = usePathname()
    const searchParams = useSearchParams();
    const q = searchParams.get("q") || '';     // ambil ?q=

    const handleWhatsapp = async () => {
        try {
            setIsLoadingWA(true)
            const waUrl = await HandleKonversiWA({
                Header: {
                    q: q,
                    pathName: pathName
                }
            });
            setIsLoadingWA(false)
            window.open(waUrl, "_blank");
        } catch (e) {
            console.log(e);
            toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
            setIsLoadingWA(false)
        }
    };
    return (
        <button
            disabled={isLoadingWA}
            className={styles.tombolwa}
            id="whatsapp-button"
            onClick={handleWhatsapp}>
            <div className={styles.tombolwadalam}>
                <Image src={`${process.env.NEXT_PUBLIC_URL}/whatsapp.webp`} height={25} width={25} alt="logo" />
                <div className={styles.wakuy}>
                    <span className={styles.wadiskon}>Diskon 3% [SK]</span>
                    <span>{isLoadingWA ? 'Loading...' : 'WhatsApp'}</span>
                </div>
            </div>
        </button>
    )
}
