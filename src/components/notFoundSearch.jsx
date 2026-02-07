'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import toast from 'react-hot-toast'
import { Unslugify } from "@/utils/unSlugify"
import styles from '@/components/notFoundSearch.module.css'
import Link from 'next/link'
import HandleKonversiWA from '@/utils/handleKonversiWA'

export default function NotFoundSearch({ q, suggest, ListSearch }) {
    const pathName = usePathname()
    const [isLoadingWA, setIsLoadingWA] = useState(false)

    const handleWhatsapp = async () => {
        try {
            setIsLoadingWA(true)
            const waUrl = await HandleKonversiWA({
                Header: {
                    q: q,
                    pathName: pathName
                }
            })
            setIsLoadingWA(false)
            window.open(waUrl, "_blank")
        } catch (e) {
            console.log(e)
            toast.error('Gagal membuka WhatsApp. Silakan coba lagi.')
            setIsLoadingWA(false)
        }
    }

    return (
        <section className={styles.notfoundContainer}>
            <h1 className={styles.notfoundTitle}>
                Hasil <span className={styles.query}>{Unslugify(q)}</span> Tidak Ditemukan 😢
            </h1>

            <p className={styles.notfoundText}>
                Produk yang Anda cari belum tersedia.
                Jangan khawatir — tim kami siap bantu mencarikannya untuk Anda.
            </p>

            {/* 👉 SUGGESTION */}
            <div className={styles.notfoundSuggestion}>
                <ul>
                    {
                        !suggest[0] ? (
                            <>
                                <p>Rekomendasi dari kami:</p>
                                {ListSearch.map((data, i) => (
                                    <li key={i}>
                                        <Link href={`/search?q=${data}`}>{data}</Link>
                                    </li>
                                ))}
                            </>
                        ) : (
                            <>
                                <p>Mungkin yang Anda cari:</p>
                                {suggest.map((item, i) => (
                                    <li key={i}>
                                        <Link href={`/search?q=${item}`}>{item}</Link>
                                    </li>
                                ))}
                            </>
                        )
                    }
                </ul>
            </div>

            {/* 👉 CTA WHATSAPP */}
            <div className={styles.notfoundCTA}>
                <button
                    onClick={handleWhatsapp}
                    disabled={isLoadingWA}
                    className={styles.notfoundButton}
                >
                    {isLoadingWA
                        ? 'Menghubungkan ke WhatsApp...'
                        : '💬 Tanya Produk via WhatsApp'}
                </button>
            </div>
        </section>
    )
}
