import styles from '@/components/termandcondition.module.css'

export default function DeliveryPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.termsConditions}>
                <div className={styles.judul}>Kebijakan Pengiriman (Delivery Policy)</div>
                <section>
                    <h2>1. Waktu Proses Pengiriman</h2>
                    <p>
                        Penjual wajib memproses pesanan dalam waktu maksimal <strong>2x24 jam</strong> hari kerja setelah pembayaran dikonfirmasi.
                    </p>
                    <p>
                        Apabila terjadi keterlambatan dalam proses pengiriman, penjual wajib menginformasikan kepada pembeli melalui sistem marketplace.
                    </p>
                </section>

                <section>
                    <h2>2. Estimasi Waktu Pengiriman</h2>
                    <p>Estimasi waktu pengiriman tergantung pada lokasi pembeli dan jasa ekspedisi yang dipilih. Rata-rata estimasi pengiriman:</p>
                    <ul>
                        <li>Wilayah Jabodetabek: <strong>1–3 hari kerja</strong></li>
                        <li>Wilayah luar Jabodetabek: <strong>2–7 hari kerja</strong></li>
                        <li>Pengiriman internasional (jika tersedia): <strong>7–21 hari kerja</strong></li>
                    </ul>
                </section>

                <section>
                    <h2>3. Jasa Ekspedisi</h2>
                    <p>
                        Marketplace kami bekerja sama dengan berbagai jasa ekspedisi terpercaya seperti JNE, J&T, SiCepat, POS Indonesia, AnterAja, dan lainnya.
                    </p>
                    <p>
                        Untuk pesanan dengan berat <strong>lebih dari 30 kg</strong>, pengiriman akan dilakukan menggunakan jasa ekspedisi khusus seperti <strong>AJS (Anugerah Jasa Supir)</strong> atau <strong>ATL (Angkutan Truk Logistik)</strong>, yang disesuaikan dengan lokasi tujuan dan jenis barang.
                    </p>
                    <p>
                        Penjual akan menginformasikan secara langsung kepada pembeli jika pengiriman dilakukan menggunakan AJS atau ATL, termasuk estimasi waktu pengiriman dan biaya tambahan (jika ada).
                    </p>
                </section>

                <section>
                    <h2>4. Biaya Pengiriman</h2>
                    <p>
                        Biaya pengiriman ditentukan berdasarkan berat/volume barang, lokasi tujuan, dan jasa ekspedisi yang dipilih.
                    </p>
                    <p>
                        Pengiriman dengan berat lebih dari 30 kg atau barang besar akan dikenakan tarif khusus sesuai dengan kebijakan ekspedisi AJS atau ATL.
                    </p>
                    <p>
                        Beberapa produk dapat memenuhi syarat untuk <strong>Gratis Ongkir</strong>, sesuai dengan syarat dan ketentuan promosi yang berlaku.
                    </p>
                </section>

                <section>
                    <h2>5. Pelacakan (Tracking)</h2>
                    <p>
                        Untuk jasa ekspedisi reguler, nomor resi (tracking number) akan tersedia di akun pembeli dan dapat digunakan untuk melacak status pengiriman.
                    </p>
                    <p>
                        Untuk pengiriman via AJS atau ATL, informasi pelacakan akan disampaikan secara manual oleh penjual (jika tersedia), atau pembeli dapat menghubungi penjual untuk update status pengiriman.
                    </p>
                </section>

                <section>
                    <h2>6. Gagal Kirim dan Pengembalian Barang</h2>
                    <p>
                        Jika terjadi kegagalan pengiriman karena alamat tidak lengkap/tidak ditemukan, pihak ekspedisi akan mengembalikan barang ke penjual.
                    </p>
                    <p>
                        Pembeli akan dihubungi untuk mengonfirmasi alamat dan dikenakan biaya pengiriman ulang (jika berlaku).
                    </p>
                </section>

                <section>
                    <h2>7. Barang Hilang atau Rusak Saat Pengiriman</h2>
                    <p>
                        Jika barang hilang atau rusak dalam proses pengiriman, pembeli dapat mengajukan klaim melalui fitur bantuan dengan melampirkan bukti yang diperlukan (foto, video unboxing, dll).
                    </p>
                    <p>
                        Proses klaim akan dibantu oleh tim marketplace sesuai dengan kebijakan ekspedisi yang digunakan.
                    </p>
                </section>

                <section>
                    <h2>8. Pengiriman oleh Penjual</h2>
                    <p>
                        Beberapa penjual dapat menggunakan layanan pengiriman pribadi (kurir toko), yang akan diinformasikan secara jelas di halaman produk.
                    </p>
                </section>

                <section>
                    <h2>📞 Kontak Pengiriman & Bantuan</h2>
                    <p>Jika Anda memiliki pertanyaan terkait pengiriman, silakan hubungi kami melalui salah satu kontak berikut:</p>
                    <ul>
                        <li>📱 +62 877-3923-5740</li>
                        <li>📱 +62 859-3855-2576</li>
                        <li>📱 +62 859-3855-2586</li>
                    </ul>
                    <p>Layanan pelanggan tersedia setiap hari kerja pukul <strong>09.00 – 17.00 WIB</strong>.</p>
                </section>
            </div>
        </div>

    )
}