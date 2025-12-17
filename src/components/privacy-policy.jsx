import styles from '@/components/privacy-policy.module.css'

export default function PrivacyPolicy() {
    return (
        <div className={styles.container}>
            <div className={styles.privacyPolicy}>
                <div className={styles.judul}>Kebijakan Privasi </div>
                <p>Di <strong>PT. Pelangi Teknik Indonesia</strong>, kami berkomitmen untuk melindungi privasi Anda. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi Anda saat Anda mengunjungi situs web kami dan melakukan pembelian melalui platform e-commerce kami untuk genset.</p>

                <section>
                    <h2>1. Informasi yang Kami Kumpulkan</h2>
                    <p>Kami dapat mengumpulkan jenis informasi pribadi berikut saat Anda menggunakan situs web kami:</p>
                    <ul>
                        <li><strong>Informasi Pribadi</strong>: Nama, alamat email, nomor telepon, dan alamat pengiriman/pembayaran.</li>
                        <li><strong>Informasi Pembayaran</strong>: Detail metode pembayaran, dan riwayat transaksi.</li>
                        {/* <li><strong>Informasi Teknis</strong>: Alamat IP, jenis browser, dan detail perangkat.</li> */}
                        <li><strong>Informasi Pesanan</strong>: Produk yang dibeli, detail pesanan, dan preferensi pengiriman.</li>
                    </ul>
                </section>

                <section>
                    <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                    <p>Kami menggunakan informasi yang kami kumpulkan untuk:</p>
                    <ul>
                        <li>Memproses  pesanan Anda dan mengirimkan produk.</li>
                        <li>Berkomunikasi dengan Anda tentang status pesanan dan permintaan dukungan pelanggan.</li>
                        <li>Meningkatkan situs web dan layanan kami berdasarkan umpan balik pengguna.</li>
                        <li>Mengirim materi promosi dan penawaran (Anda dapat berhenti berlangganan kapan saja).</li>
                        <li>Memastikan keamanan pembayaran dan mencegah penipuan.</li>
                    </ul>
                </section>

                <section>
                    <h2>3. Berbagi dan Pengungkapan Informasi</h2>
                    <p>Kami tidak menjual atau menyewakan informasi pribadi Anda. Namun, kami dapat berbagi data Anda dengan:</p>
                    <ul>
                        <li><strong>Penyedia Layanan</strong>: Untuk pemrosesan pembayaran, pemenuhan pesanan, dan pengiriman.</li>
                        <li><strong>Kepatuhan Hukum</strong>: Jika diwajibkan oleh hukum atau untuk mematuhi proses hukum atau peraturan yang berlaku.</li>
                    </ul>
                </section>

                <section>
                    <h2>4. Keamanan Data</h2>
                    <p>Kami menerapkan langkah-langkah keamanan yang tepat, seperti enkripsi dan gateway pembayaran yang aman, untuk melindungi informasi pribadi Anda dari akses, pengungkapan, atau penyalahgunaan yang tidak sah.</p>
                </section>

                <section>
                    <h2>5. Cookies</h2>
                    <p>Situs web kami menggunakan cookies untuk meningkatkan pengalaman pengguna dengan melacak aktivitas browsing. Anda dapat menonaktifkan cookies di pengaturan browser Anda, tetapi ini mungkin mempengaruhi pengalaman Anda di situs.</p>
                </section>

                <section>
                    <h2>6. Hak Anda</h2>
                    <p>Anda memiliki hak untuk mengakses, memperbarui, atau meminta penghapusan informasi pribadi Anda. Anda juga dapat memilih untuk berhenti menerima komunikasi promosi dengan menghubungi kami.</p>
                </section>

                <section>
                    <h2>7. Perubahan Kebijakan Privasi</h2>
                    <p>Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Setiap perubahan akan diposting di halaman ini, dan penggunaan situs web kami yang berkelanjutan merupakan persetujuan Anda terhadap perubahan tersebut.</p>
                </section>

                <section>
                    <h2>8. Hubungi Kami</h2>
                    <p>Jika Anda memiliki pertanyaan atau kekhawatiran mengenai Kebijakan Privasi kami, silakan hubungi kami di:</p>
                    <ul>
                        <li><strong>Email</strong>: pelangiteknikindonesia@gmail.com</li>
                        <li><strong>Telepon</strong>: +62 817-6424-276</li>
                        <li><strong>Alamat</strong>: LTC Glodok, Lantai GF2, Blok B7. 5, Jl. Hayam Wuruk No.127, Mangga Besar, Kec. Taman Sari, Daerah Khusus Ibukota Jakarta 11180</li>
                    </ul>
                </section>

                #Diupdate kamis, 24 October 2024
            </div>
        </div>
    )
}
