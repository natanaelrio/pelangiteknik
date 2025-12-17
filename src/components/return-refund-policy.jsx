import styles from '@/components/termandcondition.module.css'

export default function RetrunRefundPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.termsConditions}>
                <div className={styles.judul}>Kebijakan Pengembalian & Pengembalian Dana</div>

                <p>Terima kasih telah berbelanja di <strong>pelangiteknik.com</strong>. Kami berkomitmen untuk memberikan pengalaman belanja yang aman dan terpercaya bagi seluruh pengguna. Berikut adalah kebijakan pengembalian dan pengembalian dana kami:</p>

                <section>
                    <h2>1. Kebijakan Umum</h2>
                    <p>pelangiteknik.com mempertemukan penjual dan pembeli. Proses pengembalian barang dan dana bergantung pada kebijakan masing-masing penjual. Namun, kami menyediakan bantuan mediasi jika terjadi perselisihan.</p>
                </section>

                <section>
                    <h2>2. Kriteria Pengembalian Barang</h2>
                    <ul>
                        <li>Barang yang diterima rusak, cacat, atau tidak sesuai deskripsi.</li>
                        <li>Barang tidak sampai dalam waktu pengiriman yang dijanjikan.</li>
                        <li>Barang berbeda dari pesanan (warna, ukuran, model, dll).</li>
                    </ul>
                    <p>Barang <strong>tidak dapat dikembalikan</strong> apabila:</p>
                    <ul>
                        <li>Rusak karena kesalahan penggunaan.</li>
                        <li>Termasuk barang yang tidak bisa dikembalikan (produk digital, makanan, barang custom).</li>
                        <li>Permintaan diajukan lebih dari 7 hari setelah barang diterima.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Prosedur Pengembalian</h2>
                    <ol>
                        <li>Ajukan permintaan melalui menu “Pesanan Saya” maksimal <strong>7 hari</strong> setelah barang diterima.</li>
                        <li>Lampirkan bukti (foto/video) sebagai dokumentasi.</li>
                        <li>Penjual akan menanggapi dalam waktu <strong>2x24 jam</strong>.</li>
                        <li>Jika disetujui, pembeli mengirimkan kembali barang.</li>
                        <li>Dana dikembalikan setelah penjual menerima dan memverifikasi barang.</li>
                    </ol>
                </section>

                <section>
                    <h2>4. Pengembalian Dana</h2>
                    <p>Semua pengembalian dana dilakukan <strong>hanya melalui transfer bank</strong> ke rekening yang disampaikan oleh pembeli saat proses klaim.</p>
                    <p>Waktu proses: <strong>3–5 hari kerja</strong> setelah konfirmasi dari penjual diterima dan disetujui.</p>
                    <p>Jika ada kendala, silakan hubungi kami melalui WhatsApp.</p>
                </section>

                <section>
                    <h2>5. Biaya Pengiriman Pengembalian</h2>
                    <ul>
                        <li>Jika kesalahan berasal dari penjual, biaya pengiriman ditanggung oleh penjual.</li>
                        <li>Jika karena alasan lain, biaya pengiriman ditanggung oleh pembeli sesuai kesepakatan.</li>
                    </ul>
                </section>

                <section>
                    <h2>6. Mediasi Sengketa</h2>
                    <p>Apabila terjadi ketidaksepakatan antara pembeli dan penjual, <strong>pelangiteknik.com</strong> akan menjadi pihak mediasi. Keputusan tim kami bersifat final dan mengikat.</p>
                </section>

                <section>
                    <h2>7. Kontak</h2>
                    <p>Untuk informasi lebih lanjut atau bantuan, silakan hubungi kami melalui WhatsApp:</p>
                    <ul>
                        <li>📱 +62 877-3923-5740</li>
                        <li>📱 +62 859-3855-2576</li>
                        <li>📱 +62 859-3855-2586</li>
                    </ul>
                    <p>🕘 Jam operasional: Senin – Jumat, 09:00 – 17:00 WIB</p>
                </section>

                <p><em>#Diupdate Selasa, 27 Mei 2025</em></p>
            </div>
        </div>
    )
}
