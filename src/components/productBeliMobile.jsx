import styles from '@/components/productBeliMobile.module.css'
import { useStore } from '@/zustand/zustand'
import { FaWhatsapp, FaShareAlt } from 'react-icons/fa'
import { MdOutlineSimCardDownload } from 'react-icons/md'
import { BeatLoader } from 'react-spinners'

export default function ProductBeliMobile({ data, HandlePenawaran, handleBeliSekarang, season, handleBeliSekarangLogin, handleWhatsapp, price, stock, isLoading }) {
    const setIsShare = useStore((state) => state.setIsShare)
    const isLoadingWA = useStore((state) => state.isLoadingWA)

    const handleBeliClick = season ? handleBeliSekarang : handleBeliSekarangLogin

    return (
        <div className={styles.container}>
            <div className={styles.badge}>
                <span className={styles.badgeIcon}>🔥</span>
                Diskon 3% [SK]
            </div>

            <div className={styles.info}>
                <div className={styles.priceWrapper}>
                    <span className={styles.price}>{price}</span>
                    <span className={styles.unit}>/barang</span>
                </div>
                <div className={styles.stock}>
                    <span className={styles.stockDot}></span>
                    {stock} stock tersedia
                </div>
            </div>

            <div className={styles.actions}>
                <button
                    disabled={isLoading}
                    className={styles.buyButton}
                    onClick={handleBeliClick}
                >
                    {isLoading ? (
                        <BeatLoader color='white' size={8} />
                    ) : (
                        <>
                            <span className={styles.buttonIcon}>🛒</span>
                            Beli Sekarang
                        </>
                    )}
                </button>

                <div className={styles.actionGroup}>
                    <button
                        id="whatsapp-button"
                        className={styles.iconButton}
                        onClick={handleWhatsapp}
                        aria-label="Chat WhatsApp"
                    >
                        {isLoadingWA ? <BeatLoader color='white' size={7} /> : <FaWhatsapp size={18} />}
                    </button>

                    <button
                        className={styles.iconButton}
                        onClick={() => HandlePenawaran(data)}
                        aria-label="Buat Penawaran"
                    >
                        <MdOutlineSimCardDownload size={18} />
                    </button>

                    <button
                        className={styles.iconButton}
                        onClick={() => setIsShare()}
                        aria-label="Bagikan"
                    >
                        <FaShareAlt size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}
