import styles from '@/components/about.module.css'
import Image from 'next/image'
import Link from 'next/link';
import { IoMdDownload } from "react-icons/io";
export default function About() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.gambar}>
                    <div className={styles.gambarasli}>
                        <Image src={`${process.env.NEXT_PUBLIC_URL}/1.jpg`}
                            width={4080}
                            height={3072}>
                        </Image>
                        <div className={styles.gradient}></div>
                    </div>
                    <div className={styles.mask}></div>
                    <div className={styles.tulisan}>
                        <div className={styles.isi}>
                            <div className={styles.judul}>Tentang Kami</div>
                            <div className={styles.desc}> PT Pelangi Teknik Indonesia berdiri sejak tahun 2013,
                                memproduksi dan mendistribusikan berbagai keperluan
                                mesin-mesin untuk berbagai sektor mulai dari proyek-
                                proyek pertanian, konstruksi, pabrik hingga kebutuhan
                                mesin genset untuk pabrik dan rumahan.
                                <br />
                                <br />
                                Produk-produk dengan merk Tsuzumi Japan menjadi
                                salah satu pilihan paling laris di pasaran. Kepuasan
                                pelanggan adalah kunci utama keberhasilan kami
                                dengan mengedepankan kualitas dan servis yang baik.
                                <div className={styles.download}>
                                    <Link href={'/SURAT-TANDA-PENDAFTARAN-DISTRIBUTOR-ATAU-AGEN-PELANGITEKNIKINDONESIA.pdf'}>
                                        Surat Tanda Pendaftaran Distributor/Agen &nbsp;<IoMdDownload />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.containerbawah}>
                    <div className={styles.gambarbawah}>
                        <Image src={`${process.env.NEXT_PUBLIC_URL}/2.png`}
                            width={1080}
                            height={1072}
                            alt='gambar1'
                        >
                        </Image>
                    </div>
                    <div className={styles.text}>
                        <div>
                            <div className={styles.judul}>Visi :</div>
                            <div className={styles.desc}>
                                Menjadi Perusahaan terkemuka dalam penjualan alat-alat Teknik di Indonesia yang berorientasi pada kepuasan pelanggan.
                            </div>
                        </div>
                        <div>
                            <div className={styles.judul}>Misi :</div>
                            <div className={styles.desc}>
                                <ol>
                                    <li>
                                        Menyenangkan Pelanggan dengan
                                        memberikan produk-produk terbaik dan
                                        layanan Purna Jual yang profesional.
                                    </li>
                                    <li>
                                        Mengelola perusahaan secara good corporate
                                        governance didukung SDM profesional, jujur,
                                        disiplin, bertanggung jawab, good team work.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.container}>
                <div className={styles.containerprotofolio}>
                    <div className={styles.judul} style={{ textAlign: 'center', padding: '30px 0px' }}>PORTOFOLIO</div>
                    <div className={styles.containerkotak}>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/1.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/2.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/3.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/4.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/5.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/6.jpg`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/7.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/8.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/9.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/10.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/11.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/12.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/13.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/14.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/15.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/16.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/17.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/18.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/19.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/20.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/21.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/22.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/23.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>
                        <div className={styles.kotakgambar}>
                            <Image src={`${process.env.NEXT_PUBLIC_URL}/24.png`}
                                width={500}
                                height={500}
                                alt='gambar1'
                            />
                        </div>

                    </div>
                </div>
            </div>
        </>

    )
}
