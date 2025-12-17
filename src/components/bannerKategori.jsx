import styles from '@/components/bannerKategori.module.css'
import Image from 'next/image'

export default function BannerKategori({ data }) {
    return (
        <div className={styles.container} >
            <div className={styles.dalamkontainer}>
                <div className={styles.banner}>
                    <div className={styles.text}>
                        <h1 className={styles.judul}>
                            {data?.category} by Pelangi Teknik
                        </h1>
                        <h2 className={styles.desc}>
                            {data?.desc}
                        </h2>
                    </div>

                    <div className={styles.gambar}>
                        <Image
                            src={data?.image}
                            width={1000}
                            height={550}
                            alt={data?.category}
                        ></Image>
                    </div>

                </div>
            </div>
        </div>

    )
}
