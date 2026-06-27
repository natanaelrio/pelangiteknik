'use client';
import React, { useState } from 'react';
import styles from '@/components/v3/homeV3.module.css';

export default function HomeV3({ data, sumView, popularProducts }) {
    const [faqActive, setFaqActive] = useState(null);

    const toggleFaq = (index) => {
        setFaqActive(faqActive === index ? null : index);
    };

    return (
        <div className={styles.landingPageContainer}>
            {/* Navigation Bar */}
            <nav className={styles.navbar}>
                <div className={styles.navLogo}>⚡ VOLTMAX</div>
                <ul className={styles.navLinks}>
                    <li><a href="#features">Fitur</a></li>
                    <li><a href="#whyUs">Keunggulan</a></li>
                    <li><a href="#reviews">Testimoni</a></li>
                    <li><a href="#faq">FAQ</a></li>
                </ul>
                <button className={styles.btnContact}>Hubungi Kami</button>
            </nav>

            {/* Hero Section */}
            <header className={styles.heroSection}>
                <div className={styles.heroContent}>
                    <span className={styles.heroBadge}>⭐ Pilihan Utama Industri & Rumah Tangga</span>
                    <h1 className={styles.heroTitle}>Energi Tanpa Batas, Kapanpun Anda Membutuhkannya</h1>
                    <p className={styles.heroSubtitle}>
                        Genset tangguh berteknologi tinggi untuk memastikan bisnis dan hunian Anda tetap menyala tanpa gangguan interupsi daya.
                    </p>
                    <div className={styles.heroCtas}>
                        <button className={styles.btnPrimary}>Lihat Produk</button>
                        <button className={styles.btnSecondary}>Konsultasi Gratis</button>
                    </div>
                </div>
                <div className={styles.heroImagePlaceholder}>
                    <div className={styles.mockGensetGraphic}>
                        <span>[ Ilustrasi / Foto Genset VoltMax Heavy Duty ]</span>
                    </div>
                </div>
            </header>

            {/* Partners Section */}
            <section className={styles.partnersSection}>
                <p className={styles.partnersTitle}>Telah Dipercaya oleh Perusahaan Terkemuka</p>
                <div className={styles.partnersLogos}>
                    <div className={styles.partnerLogo}>⚙️ AstraPower</div>
                    <div className={styles.partnerLogo}>🏗️ IndoKonstruksi</div>
                    <div className={styles.partnerLogo}>🏭 FabrikasiMaju</div>
                    <div className={styles.partnerLogo}>🌐 TelcoNusantara</div>
                </div>
            </section>

            {/* Popular Products Section */}
            {popularProducts && popularProducts.length > 0 && (
                <section className={styles.popularProductsSection}>
                    <div className={styles.sectionHeader}>
                        <h2>Produk Terpopuler</h2>
                        <p>Pilihan paling banyak dicari oleh pelanggan kami.</p>
                    </div>
                    <div className={styles.popularProductsGrid}>
                        {popularProducts.slice(0, 4).map((product, index) => (
                            <div key={index} className={styles.popularProductCard}>
                                <div className={styles.popularProductImage}>
                                    {product.gambar?.[0] ? (
                                        <img src={product.gambar[0]} alt={product.nama} />
                                    ) : (
                                        <div className={styles.popularProductPlaceholder}>⚡</div>
                                    )}
                                </div>
                                <div className={styles.popularProductInfo}>
                                    <h3>{product.nama}</h3>
                                    <p className={styles.popularProductDesc}>{product.deskripsi?.slice(0, 60) || 'Genset berkualitas tinggi untuk kebutuhan Anda.'}...</p>
                                    <div className={styles.popularProductPrice}>
                                        {product.harga ? `Rp ${parseInt(product.harga).toLocaleString('id-ID')}` : 'Hubungi kami'}
                                    </div>
                                    <button className={styles.btnPopularProduct}>Lihat Detail</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Features Section */}
            <section id="features" className={styles.featuresSection}>
                <div className={styles.sectionHeader}>
                    <h2>Fitur Unggulan Genset Kami</h2>
                    <p>Teknologi mutakhir yang memastikan efisiensi tinggi dan performa optimal.</p>
                </div>
                <div className={styles.featuresGrid}>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🍃</div>
                        <h3>Eco-Throttle (Hemat Bahan Bakar)</h3>
                        <p>Sistem pintar yang menyesuaikan kecepatan mesin dengan beban listrik, menghemat solar hingga 30%.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🤫</div>
                        <h3>Super Silent Technology</h3>
                        <p>Dilengkapi dengan peredam suara berlapis maksimal, menjaga kebisingan di bawah 65 dB.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🛠️</div>
                        <h3>Heavy Duty Engine</h3>
                        <p>Mesin tangguh dirancang untuk operasional non-stop hingga 24 jam penuh tanpa penurunan performa.</p>
                    </div>
                    <div className={styles.featureCard}>
                        <div className={styles.featureIcon}>🔄</div>
                        <h3>Sistem Otomatis ATS</h3>
                        <p>Genset otomatis menyala dalam waktu kurang dari 5 detik saat mendeteksi pemadaman listrik PLN.</p>
                    </div>
                </div>
            </section>

            {/* Why Us Section */}
            <section id="whyUs" className={styles.whyUsSection}>
                <div className={styles.sectionHeader}>
                    <h2>Mengapa Memilih VoltMax?</h2>
                    <p>Kami tidak hanya menjual mesin, kami memberikan jaminan ketenangan pikiran.</p>
                </div>
                <div className={styles.whyUsGrid}>
                    <div className={styles.whyCard}>
                        <span className={styles.whyNumber}>01</span>
                        <h3>Garansi Resmi 3 Tahun</h3>
                        <p>Jaminan perlindungan penuh untuk sparepart dan servis mekanik selama 3 tahun.</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyNumber}>02</span>
                        <h3>Layanan Darurat 24/7</h3>
                        <p>Tim teknisi kami siap meluncur kapan saja Anda mengalami kendala teknis di lapangan.</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyNumber}>03</span>
                        <h3>Teknisi Bersertifikat</h3>
                        <p>Instalasi dan perawatan ditangani langsung oleh teknisi berpengalaman dan tersertifikasi resmi.</p>
                    </div>
                    <div className={styles.whyCard}>
                        <span className={styles.whyNumber}>04</span>
                        <h3>Suku Cadang Asli</h3>
                        <p>Akses ketersediaan komponen orisinal yang melimpah di seluruh jaringan dealer kami.</p>
                    </div>
                </div>
            </section>

            {/* Review Section */}
            <section id="reviews" className={styles.reviewSection}>
                <div className={styles.sectionHeader}>
                    <h2>Apa Kata Mereka?</h2>
                    <p>Kepercayaan dari pemilik bisnis dan rumah tangga yang telah terbebas dari mati lampu.</p>
                </div>
                <div className={styles.reviewGrid}>
                    <div className={styles.reviewCard}>
                        <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                        <p>"Sangat puas dengan tipe Silent 10 kVA untuk klinik kami. Suaranya halus tidak mengganggu pasien, dan otomatis menyala saat PLN padam."</p>
                        <div className={styles.reviewerInfo}>
                            <div className={styles.reviewerAvatar}></div>
                            <div>
                                <h4>dr. Andi Wijaya</h4>
                                <span>Pemilik Klinik Utama</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.reviewCard}>
                        <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                        <p>"Genset Heavy Duty VoltMax mendampingi proyek konstruksi kami di area remote selama 6 bulan tanpa kendala. Sangat tangguh!"</p>
                        <div className={styles.reviewerInfo}>
                            <div className={styles.reviewerAvatar}></div>
                            <div>
                                <h4>Budi Santoso</h4>
                                <span>Manajer Operasional PT IK</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.reviewCard}>
                        <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
                        <p>"Respon tim servisnya luar biasa cepat saat kami butuh maintenance rutin. Layanan purna jual terbaik yang pernah saya temui."</p>
                        <div className={styles.reviewerInfo}>
                            <div className={styles.reviewerAvatar}></div>
                            <div>
                                <h4>Citra Dewi</h4>
                                <span>Pemilik Restoran & Kafe</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className={styles.faqSection}>
                <div className={styles.sectionHeader}>
                    <h2>Pertanyaan yang Sering Diajukan</h2>
                    <p>Punya pertanyaan seputar genset VoltMax? Temukan jawabannya di sini.</p>
                </div>
                <div className={styles.faqList}>
                    {[
                        { q: "Bagaimana cara menentukan kapasitas kVA yang sesuai?", a: "Anda dapat menghitung total daya watt alat elektronik Anda lalu menambahkan margin sekitar 20-30% untuk beban kejut motor listrik, atau langsung hubungi tim kami untuk survei lokasi gratis." },
                        { q: "Apakah harga yang tertera sudah termasuk biaya instalasi?", a: "Ya, untuk wilayah Jabodetabek kami menyediakan gratis biaya pengiriman standar dan jasa instalasi awal hingga genset siap pakai." },
                        { q: "Apa perbedaan antara jenis Genset Open dan Genset Silent?", a: "Genset Open tidak memiliki peredam luar sehingga cocok diletakkan di ruang khusus (soundproof room). Sedangkan tipe Silent sudah dilengkapi dengan kanopi kedap suara untuk penggunaan luar ruangan." },
                        { q: "Bagaimana sistem perawatan rutin bulanan genset?", a: "Perawatan dasar meliputi pemanasan mesin secara rutin 1-2 kali seminggu selama 15 menit, serta pengecekan berkala pada volume oli dan air radiator." }
                    ].map((item, index) => (
                        <div key={index} className={`faqItem ${faqActive === index ? 'active' : ''}`} onClick={() => toggleFaq(index)}>
                            <div className={styles.faqQuestion}>
                                <h4>{item.q}</h4>
                                <span>{faqActive === index ? '−' : '+'}</span>
                            </div>
                            {faqActive === index && <div className={styles.faqAnswer}><p>{item.a}</p></div>}
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaBox}>
                    <h2>Siap Amankan Pasokan Energi Anda?</h2>
                    <p>Jangan biarkan pemadaman listrik merugikan bisnis atau mengganggu kenyamanan keluarga Anda. Dapatkan penawaran harga terbaik hari ini.</p>
                    <button className={styles.btnCtaMain}>Mulai Konsultasi Sekarang</button>
                </div>
            </section>

            {/* Footer */}
            <footer className={styles.footer}>
                <div className={styles.footerTop}>
                    <div className={styles.footerBrand}>
                        <h3>⚡ VOLTMAX</h3>
                        <p>Solusi backup daya terpercaya untuk masa depan industri Indonesia.</p>
                        <div className={styles.newsletter}>
                            <input type="email" placeholder="Masukkan email Anda" />
                            <button>Daftar</button>
                        </div>
                    </div>
                    <div className={styles.footerLinksGroup}>
                        <h4>Tautan Utama</h4>
                        <ul>
                            <li><a href="#features">Produk</a></li>
                            <li><a href="#whyUs">Tentang Kami</a></li>
                            <li><a href="#reviews">Testimoni</a></li>
                        </ul>
                    </div>
                    <div className={styles.footerLinksGroup}>
                        <h4>Media Sosial</h4>
                        <ul>
                            <li><a href="#">Instagram</a></li>
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">LinkedIn</a></li>
                        </ul>
                    </div>
                    <div className={styles.footerLinksGroup}>
                        <h4>Legalitas</h4>
                        <ul>
                            <li><a href="#">Syarat & Ketentuan</a></li>
                            <li><a href="#">Kebijakan Privasi</a></li>
                            <li><a href="#">Sertifikasi ISO</a></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.footerBottom}>
                    <p>&copy; 2026 VOLTMAX Power Solution. Hak Cipta Dilindungi Undang-Undang.</p>
                </div>
            </footer>
        </div>
    );
}