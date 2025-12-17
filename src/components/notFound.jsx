'use client'
import { useEffect } from 'react';
import styles from '@/components/notFound.module.css'
import { useRouter } from 'nextjs-toploader/app';

export default function NotFound({ textSearch }) {
    const router = useRouter()

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 3000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className={styles.container}>
            <div className={styles.dalamcontainer}>
                <div className={styles.kotak}>
                    <div className={styles.emot}>
                        😒
                    </div>
                    <div className={styles.text1}>
                        {textSearch ? `Ups, Pencarian ${decodeURIComponent(textSearch)}` : 'Ups, halaman tidak ditemukan'}
                    </div>
                    <div className={styles.text2}>
                        {textSearch ? 'Kami tidak dapat menemukan item yang Anda cari, mungkin ada sedikit kesalahan ejaan?' : 'Halaman yang Anda cari tidak ditemukan'}
                    </div>
                    <button onClick={() => router.push('/')}>KEMBALI </button>
                </div>
            </div>
            <div className={styles.bg1}>?</div>
            <div className={styles.bg2}>?</div>
            <div className={styles.bg3}>?</div>
        </div>
    )
}
