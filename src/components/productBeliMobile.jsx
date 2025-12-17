import styles from '@/components/productBeliMobile.module.css'
import { useStore } from '@/zustand/zustand';
import { FaWhatsapp } from "react-icons/fa";
import { BeatLoader } from 'react-spinners'
import { FaShareAlt } from "react-icons/fa";
import { MdOutlineSimCardDownload } from "react-icons/md";

export default function ProductBeliMobile({ data, HandlePenawaran, handleBeliSekarang, season, handleBeliSekarangLogin, handleWhatsapp, price, stock, isLoading }) {
    const setIsShare = useStore((state) => state.setIsShare)
    const isLoadingWA = useStore((state) => state.isLoadingWA)

    return (
        <div className={styles.container}>
            <div className={styles.atas}>
                <div className={styles.harga}>
                    {price} / barang
                    {/* <div className={styles.penawaran}>Buat Penawaran ?</div> */}
                </div>
                <div className={styles.stock}>( {stock} stock ) </div>
            </div>
            <div className={styles.bawah}>
                {season ? <button disabled={isLoading} className={styles.belisekarang} onClick={handleBeliSekarang}>
                    {isLoading ? <BeatLoader color='white' /> : 'Beli Sekarang'}
                </button > : <button disabled={isLoading} className={styles.belisekarang} onClick={handleBeliSekarangLogin}>
                    {isLoading ? <BeatLoader color='white' /> : 'Beli Sekarang'}
                </button >}
                <div id="whatsapp-button" className={styles.wa} onClick={() => handleWhatsapp()}>
                    {isLoadingWA ? <BeatLoader color='white' size={7} /> : <FaWhatsapp size={20} />}
                </div>
                <div className={styles.penawaran} onClick={() => HandlePenawaran(data)}> <MdOutlineSimCardDownload size={20} /> </div>
                <div className={styles.share} onClick={() => setIsShare()}>
                    <FaShareAlt size={20} />
                </div>
            </div>
        </div>
    )
}
