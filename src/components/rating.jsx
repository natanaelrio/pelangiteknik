import styles from '@/components/rating.module.css'
import { FaStar } from "react-icons/fa6";
import { FaQuoteLeft } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';

export default function Rating({ data }) {

    const reviews = data?.reviews
        ?.sort((a, b) => b.time - a.time)
        ?.slice(0, 6)

    return (

        <section className={styles.container}>

            <div className={styles.header}>
                <h2>Ulasan Pelanggan</h2>
                <p>Testimoni pelanggan yang telah menggunakan genset kami</p>
            </div>

            <div className={styles.grid}>

                {reviews?.map((item, i) => (

                    <Link
                        href="https://maps.app.goo.gl/VPYu5gcu25xUNAe18"
                        target="_blank"
                        className={styles.card}
                        key={i}
                    >

                        <div className={styles.quoteIcon}>
                            <FaQuoteLeft />
                        </div>

                        <p className={styles.reviewText}>
                            {item?.text}
                        </p>

                        <div className={styles.footer}>

                            <div className={styles.avatar}>
                                <Image
                                    src={item?.profile_photo_url}
                                    width={50}
                                    height={50}
                                    alt={item?.author_name}
                                />
                            </div>

                            <div className={styles.meta}>

                                <div className={styles.name}>
                                    {item?.author_name}
                                </div>

                                <div className={styles.rating}>

                                    <div className={styles.stars}>
                                        {[...Array(item?.rating || 5)].map((_, i) => (
                                            <FaStar key={i} />
                                        ))}
                                    </div>

                                    <span className={styles.time}>
                                        {item?.relative_time_description}
                                    </span>

                                </div>

                            </div>

                        </div>

                    </Link>

                ))}

            </div>

        </section>

    )
}