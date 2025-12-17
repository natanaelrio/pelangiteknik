'use client';
import styles from "@/components/artikel/listArtikel.module.css";
import Link from "next/link";
import Limited from "@/components/limited";

export default function ListArtikel({ data }) {
    return (
        <>
            <section className={styles.newsroom}>
                {/* Header */}
                <header className={styles.newsroomHeader}>
                    <p className={styles.subtitle}>GENSET & MACHINERY RESOURCES</p>
                    <h1 className={styles.title}>BERITA & INFORMASI PERALATAN MESIN</h1>
                    <p className={styles.desc}>
                        Temukan tips, panduan, dan berita terkini seputar genset, mesin industri,
                        serta peralatan pendukung lainnya untuk rumah maupun bisnis.
                    </p>
                </header>

                {/* Grid Artikel */}
                <div className={styles.newsGrid}>
                    {data?.map((item) => (
                        <Link href={`/blog/${item?.slug}`} key={item?.id} className={styles.newsCard}>
                            {/* Thumbnail */}
                            <div className={styles.thumb}>
                                <img
                                    src={item?.imageProductArtikel?.[0]?.url || "/placeholder.jpg"}
                                    alt={item?.title}
                                />
                            </div>

                            {/* Konten */}
                            <div className={styles.newsContent}>
                                <h3 className={styles.newsTitle}>{item?.title}</h3>
                                <p className={styles.newsDesc}>{item?.description}</p>
                                <div className={styles.meta}>
                                    <span className={styles.tag}>News</span>
                                    <span className={styles.date}>
                                        {new Date(item?.createdAt).toLocaleDateString("en-US", {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
            <Limited />
        </>
    );
}
