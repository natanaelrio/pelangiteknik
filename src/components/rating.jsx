import styles from '@/components/rating.module.css'
import { FaStar } from "react-icons/fa6";
import { FaQuoteLeft } from "react-icons/fa";
import Image from 'next/image';
import Link from 'next/link';

export default function Rating({ data }) {
    return (
        <div className={styles.container}>
            <div className={styles.kotakdalam}>
                {data?.reviews?.sort((a, b) => b.time - a.time).map((data, i) => {
                    return (
                        <>
                            <Link href={`https://maps.app.goo.gl/VPYu5gcu25xUNAe18`} target='_blank' className={styles.kotak} key={i}>
                                <div className={styles.qoute}>
                                    <FaQuoteLeft />
                                </div>
                                <div className={styles.quote}>
                                    {data?.text}
                                </div>
                                <div className={styles.bawah}>
                                    <div className={styles.kiri}>
                                        <Image src={data?.profile_photo_url} width={30} height={30} alt={data.author_name}></Image>
                                    </div>
                                    <div className={styles.kanan}>
                                        <div className={styles.name}>
                                            {data?.author_name}
                                        </div>
                                        <div className={styles.rating}>
                                            <FaStar />    {data?.rating} -  {data?.relative_time_description}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </>
                    )
                })}
            </div>
        </div>
    )
}
