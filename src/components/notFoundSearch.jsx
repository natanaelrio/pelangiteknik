'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Slugify } from "@/utils/slugify";
import styles from '@/components/notFoundSearch.module.css'

export default function NotFoundSearch({ q }) {
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
            <h1 className={styles.notfoundTitle}>Hasil <span className={styles.query}>{q}</span>Tidak Ditemukan 😢</h1>
            <p className={styles.notfoundText}>
                Maaf, kami tidak menemukan apa pun yang cocok dengan pencarian Anda.
                Coba ketik ulang kata kunci di bawah ini.
            </p>

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
