'use client'
import styles from '@/components/loading.module.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function IsLoading() {
    return (
            <div className={styles.container}>

                <div className={styles.dalamcontainer}>


                    <div className={styles.mainSkeleton}>
                        {/* Simulasi gambar besar atau banner */}
                        <Skeleton height={250} width="100%" style={{ marginBottom: '20px' }} />

                        {/* Simulasi judul besar */}
                        <Skeleton height={40} width={300} style={{ marginBottom: '10px' }} />

                        {/* Simulasi teks pendek dengan variasi panjang */}
                        <Skeleton height={20} width={200} style={{ marginBottom: '5px' }} />
                        <Skeleton height={20} width={180} style={{ marginBottom: '5px' }} />
                        <Skeleton height={20} width={220} />
                    </div>
                    <div className={styles.productList}>
                        {Array(4).fill().map((_, index) => (
                            <div className={styles.productItem} key={index}>
                                {/* Variasi ukuran skeleton gambar produk */}
                                <Skeleton height={Math.random() > 0.5 ? 200 : 180} width={Math.random() > 0.5 ? 150 : 150} />

                                {/* Variasi ukuran skeleton judul produk */}
                                <Skeleton height={20} width={Math.random() > 0.5 ? 120 : 150} style={{ margin: '10px 0' }} />

                                {/* Variasi jumlah dan ukuran skeleton deskripsi produk */}
                                <Skeleton count={Math.random() > 0.5 ? 1 : 2} height={15} width={Math.random() > 0.5 ? 170 : 160} style={{ marginBottom: '10px' }} />

                                {/* Skeleton untuk harga produk */}
                                <Skeleton height={25} width={100} />

                                {/* Tambahkan skeleton untuk tombol (simulasi) */}
                                <Skeleton height={30} width={120} style={{ marginTop: '10px' }} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
    )
}


