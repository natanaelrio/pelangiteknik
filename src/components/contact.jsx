import styles from '@/components/about.module.css'
export default function Contact() {
    return (
        <>
            <div className={styles.container}>
                <div className={styles.containerbawah}>
                    <div className={styles.gambarbawah}>
                        <iframe className={styles.map} src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63470.143651135986!2d106.7407549486328!3d-6.146281799999984!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f79b5218b78d%3A0x92b919673c00d2c2!2sPT.%20Pelangi%20Teknik%20Indonesia!5e0!3m2!1sen!2sid!4v1722924758833!5m2!1sen!2sid" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                    </div>
                    <div className={styles.text}>
                        <div>
                            <div className={styles.judul}>Alamat :</div>
                            <div className={styles.desc}>
                                LTC Glodok, Lantai GF2, Blok B7. 5, Jl. Hayam Wuruk No.127, Mangga Besar, Kec. Taman Sari, Daerah Khusus Ibukota Jakarta 11180
                            </div>
                        </div>
                        <div>
                            <div className={styles.judul}>Nomer Hp :</div>
                            <div className={styles.desc}>
                                <ol>
                                    <li>
                                        0859-3855-2576
                                    </li>
                                    <li>
                                        0877-3923-5740
                                    </li>
                                    <li>
                                        0859-3855-2586
                                    </li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
