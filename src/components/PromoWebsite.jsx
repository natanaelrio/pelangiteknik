'use client'
import styles from '@/components/PromoWebsite.module.css'
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function PromoWebsite() {
    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <div className={styles.backdrop} onClick={() => setShow(false)}>
            <div className={styles.container} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={() => setShow(false)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className={styles.imageWrapper}>
                    <Image
                        src="/emoney3.jpg"
                        alt="Promo Belanja Website"
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                    <div className={styles.badge}>
                        <span>Promo</span>
                    </div>
                </div>

                <div className={styles.content}>
                    <h2>Promo Belanja Website</h2>
                    <p>
                        Belanja melalui website dan dapatkan{' '}<br />
                        <strong>Voucher 3%</strong> + <strong>E-Money Rp100.000</strong>
                    </p>
                    {/* <p className={styles.termsText}>
                        *S&K: Min transaksi Tsuzumi Rp 10JT (Gratis Ongkir Jabodetabek) atau Rp 15JT (Diskon 3%)
                    </p> */}
                    <Link target="_blank" href="/policies/promo-policy" className={styles.termsLink}>
                        Lihat Syarat & Ketentuan
                    </Link>
                    <br />
                    <button className={styles.button} onClick={() => setShow(false)}>
                        Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}
