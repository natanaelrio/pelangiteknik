'use client'
import styles from "@/components/search.module.css"
import { FaSearch } from "react-icons/fa";
import { useRouter } from 'nextjs-toploader/app';
import { useRouter as useRouter2 } from "next/navigation";
import { useStore } from "@/zustand/zustand";
import { useRef, useState } from "react";
import { Slugify } from "@/utils/slugify";
import toast from 'react-hot-toast';
import { IoSearchOutline } from "react-icons/io5";
import { useEffect } from "react";

export default function Search({ ListSearch }) {
    const router = useRouter();
    const router2 = useRouter2();
    const setSearchTermClose = useStore((state) => state.setSearchTermClose);
    const setIsMobileMenuOpenPencarian = useStore((state) => state.setIsMobileMenuOpenPencarian);
    const [cari, setCari] = useState('');
    const [showRecommendations, setShowRecommendations] = useState(false);

    // Data dummy rekomendasi
    const recommendations = ListSearch || [
        "kompressor",
        "genset",
        "pompa air",
        "mesin las",
        "air less",
        "tsuzumi japan",
        "genset silent",
    ];

    const [placeholder, setPlaceholder] = useState("");

    const recIndex = useRef(0);
    const charIndex = useRef(0);
    const isDeleting = useRef(false);

    useEffect(() => {
        let interval;
        let timeout;

        const startTyping = () => {
            const current = recommendations[recIndex.current];
            if (!current) return;

            interval = setInterval(() => {
                if (!isDeleting.current) {
                    // proses mengetik
                    setPlaceholder(current.slice(0, charIndex.current + 1));
                    charIndex.current++;

                    // selesai mengetik
                    if (charIndex.current === current.length) {
                        clearInterval(interval);

                        timeout = setTimeout(() => {
                            isDeleting.current = true;
                            startTyping();
                        }, 1000);
                    }
                } else {
                    // proses menghapus
                    setPlaceholder(current.slice(0, charIndex.current - 1));
                    charIndex.current--;

                    // selesai hapus → ganti item
                    if (charIndex.current === 0) {
                        isDeleting.current = false;
                        recIndex.current = (recIndex.current + 1) % recommendations.length;
                        clearInterval(interval);

                        timeout = setTimeout(() => {
                            startTyping();
                        }, 300);
                    }
                }
            }, isDeleting.current ? 40 : 80);
        };

        startTyping();

        // CLEANUP — sangat penting!
        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, [recommendations]);


    const handleChange = (event) => {
        setCari(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (cari.length >= 2) {
            router.push(`/search?q=${Slugify(cari)}`);
            // toast.success('Tunggu Yaaaa...');
            router2.refresh();
            setIsMobileMenuOpenPencarian(false);
            setShowRecommendations(false);
            setCari('')
        } else {
            toast.error('Minimal 2 Karakter');
        }
        setSearchTermClose();
        setShowRecommendations(false);
    };

    const handleRecommendationClick = (item) => {
        // setCari(item);
        router.push(`/search?q=${Slugify(item)}`);
        // toast.success('Tunggu Yaaaa...');
        setShowRecommendations(false);
        setCari('');
        setIsMobileMenuOpenPencarian(false);
        setSearchTermClose();
        router2.refresh();
    };

    // Klik di searchWrapper => tampilkan rekomendasi
    const handleWrapperClick = () => {
        setShowRecommendations(true);
    };
    const navRefMobilePencarian = useRef(null)
    useEffect(() => {
        const handleClickOutsidePencarian = (e) => {
            if (navRefMobilePencarian.current && !navRefMobilePencarian.current.contains(e.target)) {
                setShowRecommendations(false)
            }
        }
        if (showRecommendations) {
            document.addEventListener("mousedown", handleClickOutsidePencarian)
        } else {
            document.removeEventListener("mousedown", handleClickOutsidePencarian)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutsidePencarian)
        }
    }, [showRecommendations])

    return (
        <div className={styles.searchWrapper} onClick={handleWrapperClick} ref={navRefMobilePencarian}>
            <form onSubmit={handleSubmit} className={styles.form} >
                <button type="submit" className={styles.icon}>
                    <IoSearchOutline size={22} />
                </button>
                <input
                    type="text"
                    value={cari}
                    onChange={handleChange}
                    placeholder={placeholder}
                />
                <button className={styles.mobile} type="submit">
                    <FaSearch />
                </button>
            </form>

            {showRecommendations && (
                <>
                    <div className={styles.recommendations}>
                        <span>Rekomendasi Pencarian</span>
                        <ul >
                            {recommendations?.map((item, index) => (
                                <li key={index}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRecommendationClick(item)
                                    }}
                                    onFocus={() => setShowRecommendations(true)}  // <<< WAJIB
                                >
                                    <IoSearchOutline size={22} />       {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
        </div>
    );
}