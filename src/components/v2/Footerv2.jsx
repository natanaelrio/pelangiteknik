'use client'

import styles from '@/components/v2/Footerv2.module.css'
import Link from 'next/link'
import Image from 'next/image'
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi"
import TombolWA from '@/components/TombolWA'

export default function FooterV2() {

    const payments = [
        "white-logo-visa.svg",
        "white-logo-mastercard.webp",
        "white-logo-jcb.webp",
        "white-logo-amex.webp",
        "white-logo-bri.webp",
        "white-logo-bni.webp",
        "white-logo-bca.webp",
        "white-logo-mandiri.webp",
    ]

    return (
        <>
            <footer className={styles.footer}>

                <div className={styles.container}>

                    {/* COMPANY INFO */}

                    <div className={styles.brandSection}>

                        <h3 className={styles.title}>
                            Pelangi Teknik Indonesia
                        </h3>

                        <iframe
                            className={styles.map}
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63470.143651135986!2d106.7407549486328!3d-6.146281799999984!2m3!1f0!2f0!3f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f79b5218b78d%3A0x92b919673c00d2c2!2sPT.%20Pelangi%20Teknik%20Indonesia!5e0!3m2!1sen!2sid!4v1722924758833!5m2!1sen!2sid"
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                        />

                        <div className={styles.contactList}>

                            <Link
                                href="https://maps.app.goo.gl/tvgikQ69BHTZnMPY9"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.contactItem}
                            >
                                <FiMapPin />
                                LTC Glodok Lantai GF2 Blok B7.5
                            </Link>

                            <a
                                href="mailto:pelangiteknik@rocketmail.com"
                                className={styles.contactItem}
                            >
                                <FiMail />
                                pelangiteknik@rocketmail.com
                            </a>

                            {/* PHONE (TEXT ONLY) */}

                            <span className={styles.contactItem}>
                                <FiPhone />
                                0859-3855-2576
                            </span>

                            <span className={styles.contactItem}>
                                <FiPhone />
                                0877-3923-5740
                            </span>

                            <span className={styles.contactItem}>
                                <FiPhone />
                                0859-3855-2586
                            </span>

                        </div>

                    </div>


                    {/* PAYMENT METHODS */}

                    <div className={styles.section}>

                        <h3 className={styles.title}>
                            Metode Pembayaran
                        </h3>

                        <Image
                            src="https://www.paper.id/assets/images/seo/paper-logo-dark.svg"
                            alt="Paper.id"
                            width={120}
                            height={100}
                        />

                        <div className={styles.paymentGrid}>
                            {payments.map((img, i) => (
                                <div key={i} className={styles.paymentItem}>
                                    <Image
                                        key={i}
                                        src={`https://storage.googleapis.com/clevertap-assets/paper-lp/bank-logo/${img}`}
                                        alt={`Metode pembayaran ${img}`}
                                        width={60}
                                        height={40}
                                        loading="lazy"
                                    />
                                </div>
                            ))}

                            <div className={styles.morePayment}>
                                dan lainnya
                            </div>

                        </div>

                    </div>


                    {/* QUICK LINKS */}

                    <div className={styles.section}>

                        <h3 className={styles.title}>
                            Navigasi Cepat
                        </h3>

                        <div className={styles.links}>
                            <Link href="/product">Produk</Link>
                            <Link href="/about">Tentang Kami</Link>
                            <Link href="/blog">Artikel</Link>
                            <Link href="/contact">Kontak</Link>
                        </div>

                        <h3 className={styles.title}>
                            Kebijakan
                        </h3>

                        <div className={styles.links}>
                            <Link href="/policies/privacy-policy">
                                Privacy Policy
                            </Link>

                            <Link href="/policies/term-and-condition">
                                Terms of Service
                            </Link>

                            <Link href="/policies/return-refund-policy">
                                Return & Refund Policy
                            </Link>

                            <Link href="/policies/delivery-policy">
                                Delivery Policy
                            </Link>
                        </div>

                    </div>

                </div>


                {/* FOOTER BOTTOM */}

                <div className={styles.bottom}>
                    <p>
                        © {new Date().getFullYear()} Pelangi Teknik Indonesia.
                        Seluruh hak cipta dilindungi.
                    </p>
                </div>

            </footer>

            <TombolWA />
        </>
    )
}