import styles from '@/components/bagikan.module.css'
import { useLockBodyScroll } from "@uidotdev/usehooks";
import {
    FacebookIcon,
    FacebookShareButton,
    TelegramIcon,
    TelegramShareButton,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton,
    XIcon,
} from "react-share";
import { useStore } from '@/zustand/zustand';
import { useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi'; // react-icons

export default function Bagikan({ data }) {
    useLockBodyScroll();
    const setIsShare = useStore((state) => state.setIsShare);
    const [copied, setCopied] = useState(false);

    const shareUrl = `${process.env.NEXT_PUBLIC_URL}/product/${data?.slugProduct}`;
    const title = data?.productName;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Gagal menyalin URL:', err);
        }
    };

    return (
        <>
            <div className={styles.container} onClick={() => setIsShare()}></div>
            <div className={styles.content}>
                <div className={styles.judul}>
                    Bagikan {data?.productName}
                    <div className={styles.close} onClick={() => setIsShare()}>X</div>
                </div>

                {/* 🔹 Bagian tombol share */}
                <div className={styles.tombol}>
                    <div>
                        <FacebookShareButton url={shareUrl} className={styles.icon}>
                            <FacebookIcon size={50} square />
                        </FacebookShareButton>
                    </div>

                    <div>
                        <TwitterShareButton url={shareUrl} title={title} className={styles.icon}>
                            <XIcon size={50} square />
                        </TwitterShareButton>
                    </div>

                    <div>
                        <TelegramShareButton url={shareUrl} title={title} className={styles.icon}>
                            <TelegramIcon size={50} square />
                        </TelegramShareButton>
                    </div>

                    <div>
                        <WhatsappShareButton url={shareUrl} title={title} className={styles.icon}>
                            <WhatsappIcon size={50} square />
                        </WhatsappShareButton>
                    </div>
                </div>

                {/* 🔹 Box copy link seperti contoh gambar */}
                <div className={styles.copyBox}>
                    <span className={styles.copyUrl}>{shareUrl}</span>
                    <button onClick={handleCopy} className={styles.copyButton}>
                        {copied ? (
                            <>
                                <FiCheck size={16} /> <span>Disalin!</span>
                            </>
                        ) : (
                            <>
                                <FiCopy size={16} /> <span>Copy</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
