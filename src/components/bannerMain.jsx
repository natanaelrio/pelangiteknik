'use client'
import styles from '@/components/bannerMain.module.css'
import React, { useCallback } from 'react'
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// import required modules
import Image from 'next/image';
import Link from 'next/link';

import { DotButton, useDotButton } from '@/components/EmblaCarauselDotButton'
import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'

export default function BannerMain({ data }) {

    const options = { loop: true }
    const SLIDE_COUNT = 5
    const slides = Array.from(Array(SLIDE_COUNT).keys())

    const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay()])

    const onNavButtonClick = useCallback((emblaApi) => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const resetOrStop =
            autoplay.options.stopOnInteraction === false
                ? autoplay.reset
                : autoplay.stop

        resetOrStop()
    }, [])

    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
        emblaApi,
        onNavButtonClick
    )

    return (
        <div className={styles.container}>
            <div className={styles.kotak1}>
            </div>

            <div className={styles.containerdalam}>
                <section className={styles.embla}>
                    <div className={styles.emblaViewport} ref={emblaRef}>
                        <div className={styles.emblaContainer}>
                            {data?.map((data, i) => {
                                return (
                                    data?.image != "https://www.pelangiteknik.com/notfoundimage.png" &&
                                    <Link key={i} href={`/category/${data?.slugCategory}`}>
                                        <div className={styles.gambar}>
                                            <Image src={data?.image}
                                                alt='satu'
                                                width={1080}
                                                height={500}
                                            />
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>

                    <div className={styles.emblaControls}>
                        <div className={styles.emblaDots}>
                            {scrollSnaps.map((_, index) => (
                                <DotButton
                                    key={index}
                                    onClick={() => onDotButtonClick(index)}
                                    className={styles.emblaDot.concat(
                                        index === selectedIndex ? ` ${styles.emblaDotSelected}` : ''
                                    )}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </div>
            <div className={styles.kotak2}>
            </div>
        </div >
    )
}
