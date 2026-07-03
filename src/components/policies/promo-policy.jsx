import styles from '@/components/policies/termandcondition.module.css'

export default function PromoPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.termsConditions}>
                <div className={styles.judul}>Kebijakan Promo</div>

                <section>
                    <h2>1. Promo Emoney + Gratis Ongkir Wilayah Jabodetabek</h2>
                    <ul>
                        <li><strong>Benefit</strong>: Gratis ongkir untuk wilayah Jabodetabek</li>
                        <li><strong>Syarat & Ketentuan</strong>:
                            <ul>
                                <li>Minimal transaksi brand Tsuzumi Rp 10.000.000,-</li>
                                <li>Wajib menggunakan Google Maps untuk verifikasi alamat pengiriman</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>2. Diskon 3%</h2>
                    <ul>
                        <li><strong>Benefit</strong>: Diskon 3% dari total transaksi</li>
                        <li><strong>Syarat & Ketentuan</strong>:
                            <ul>
                                <li>Brand Tsuzumi</li>
                                <li>Minimal transaksi Rp 15.000.000,- ke atas</li>
                                <li>Wajib menggunakan Google Maps untuk verifikasi alamat pengiriman</li>
                            </ul>
                        </li>
                    </ul>
                </section>

                <section>
                    <h2>Catatan</h2>
                    <p>Kebijakan promo dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya. Untuk informasi lebih lanjut, silakan hubungi kami.</p>
                </section>

                #Diupdate Jum;at, 03 Juli 2026
            </div>
        </div>
    )
}
