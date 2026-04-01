import styles from '@/components/bannerKategori.module.css'

export default function BannerKategori({ data }) {
    return (
        <section className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    <span className={styles.badge}>Kategori</span>
                    <h1 className={styles.title}>
                        {data?.category}
                    </h1>
                    <p className={styles.subtitle}>by Pelangi Teknik</p>
                    <p className={styles.description}>
                        {data?.desc}
                    </p>
                    <div className={styles.decorLine} />
                </div>
            </div>
        </section>
    )
}
