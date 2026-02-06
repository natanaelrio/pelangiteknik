'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Slugify } from "@/utils/slugify";
import { Unslugify } from "@/utils/unSlugify";
import styles from '@/components/notFoundSearch.module.css'
import Link from 'next/link';

export default function NotFoundSearch({ q, suggest, ListSearch }) {
    const router = useRouter()
    const [cari, setCari] = useState('')

    const handleChange = (event) => {
        setCari(Slugify(event.target.value))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        if (cari.length >= 2) {
            router.push(`/search?q=${cari}`)
            toast.success('Sedang mencari hasil yang sesuai...')
        } else {
            toast.error('Minimal 2 karakter untuk pencarian.')
        }
    }

    return (
        <section className={styles.notfoundContainer}>
            <h1 className={styles.notfoundTitle}>
                Hasil <span className={styles.query}>{Unslugify(q)}</span> Tidak Ditemukan 😢
            </h1>

            <p className={styles.notfoundText}>
                Maaf, kami tidak menemukan produk yang sesuai dengan pencarian Anda.
                Silakan periksa kembali kata kunci atau coba alternatif di bawah ini.
            </p>

            {/* 👉 SUGGESTION */}
            <div className={styles.notfoundSuggestion}>
                <ul>
                    {
                        !suggest[0] ?
                            <>
                                <p>Rekomendasi dari kami:</p>
                                {ListSearch.map((data, i) => {
                                    return (
                                        <li key={i}>
                                            <Link href={`/search?q=${data}`}>{data}</Link>
                                        </li>
                                    )
                                })}

                            </>
                            :

                            <>
                                <p>Mungkin yang Anda cari:</p>
                                {suggest.map((suggest, i) => {
                                    return (
                                        <li key={i}>
                                            <Link href={`/search?q=${suggest}`}>{suggest}</Link>
                                        </li>
                                    )
                                })}
                            </>
                    }
                </ul>
            </div>

            <form onSubmit={handleSubmit} className={styles.notfoundForm}>
                <input
                    type="text"
                    placeholder="Cari produk, kategori, atau merek..."
                    value={cari}
                    onChange={handleChange}
                    className={styles.notfoundInput}
                />
                <button type="submit" className={styles.notfoundButton}>
                    Cari Lagi 🔍
                </button>
            </form>
        </section>

    )
}
