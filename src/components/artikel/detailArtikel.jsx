'use client'
import { useEffect, useState } from "react";
import styles from "@/components/artikel/detailArtikel.module.css";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import Limited from "@/components/limited";
import ProductCard from "@/components/artikel/productArtikel";

export default function DetailArtikel({ data }) {
    const [copied, setCopied] = useState(false);
    const shareUrl = `${process.env.NEXT_PUBLIC_URL}/blog/${data?.slug}`;
    const tanggal = new Date(data?.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Gagal menyalin:", err);
        }
    };


    return (
        <>
            <article className={styles.detailArtikel}>
                {/* ----- HEADER ----- */}
                <header className={styles.header}>
                    <div className={styles.meta}>
                        {/* 🔹 tampilkan semua tag */}
                        <div className={styles.tags}>
                            {data?.tagsArtikel?.map((tag) => (
                                <span key={tag.id} className={styles.category}>
                                    # {tag.name}
                                </span>
                            ))}
                        </div>

                        <h1 className={styles.title}>{data?.title}</h1>
                        <p className={styles.date}>
                            Dipublikasikan: {tanggal} – oleh {data?.categoryArtikel?.category}
                        </p>
                    </div>
                    {data?.imageProductArtikel?.[0]?.secure_url && (
                        <div className={styles.cover}>
                            <Image
                                src={data?.imageProductArtikel[0].secure_url}
                                alt={data?.title}
                                width={900}
                                height={500}
                                priority
                            />
                        </div>
                    )}

                </header>

                {/* ----- CONTENT ----- */}
                <section className={styles.content}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{data?.content}</ReactMarkdown>
                    {/* <ReactMarkdown>?{content}</ReactMarkdown> */}
                </section>
                <div>
                    {/* <div>Produk Terkait</div> */}
                    {data?.relatedProducts?.map((p) => (
                        <ProductCard key={p?.id} product={p} />
                    ))}
                </div>
                {/* ----- FOOTER ----- */}
                <footer className={styles.footer}>
                    <Link href="/blog" className={styles.backLink}>
                        ← Kembali ke Blog
                    </Link>

                    <div className={styles.shareBox}>
                        <div className={styles.shareTitle}>Share Article</div>
                        <div className={styles.shareInput}>
                            <input type="text" value={shareUrl} readOnly />
                            <button onClick={handleCopy}>
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                </footer>
            </article>
            <Limited />
        </>
    );
}
