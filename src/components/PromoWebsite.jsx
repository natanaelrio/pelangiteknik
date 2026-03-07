'use client'
import styles from '@/components/PromoWebsite.module.css'
import { useState } from "react";

export default function PromoWebsite({ onShop }) {
    const [show, setShow] = useState(true);

    if (!show) return null;

    return (
        <div className={styles.overlay} onClick={() => setShow(false)}>

            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className={styles.close}
                    onClick={() => setShow(false)}
                >
                    ✕
                </button>

                <div className={styles.imageWrapper}>
                    <img
                        src="/emoney3.jpg"
                        alt="Promo Belanja Website"
                    />
                </div>

                <div className={styles.content}>

                    <div className={styles.title}>
                        Promo Belanja Website
                    </div>

                    <div className={styles.desc}>
                        Belanja melalui website dan dapatkan
                        <b> Voucher 3%</b> + <b>E-Money Rp100.000</b>.
                    </div>

                    <button
                        className={styles.button}
                        onClick={onShop}
                    >
                        Mengerti
                    </button>

                </div>
            </div>

        </div>
    );
}