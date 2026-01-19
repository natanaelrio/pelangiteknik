import React, { useState, useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Image from 'next/image'
import styles from '@/components/EmblaCarousel.module.css'
import { FaRegCirclePlay } from "react-icons/fa6";

import {
    PrevButton,
    NextButton,
    usePrevNextButtons
} from '@/components/EmblaCarouselArrowButtons'
import { TikTokEmbed, YouTubeEmbed } from 'react-social-media-embed'

const EmblaCarousel = ({ productName, e, yt, type }) => {
    const videoYT = [
        {
            "youtube_id": yt, // YouTube video ID
            "asset_id": "video-1"
        }
    ]
    const data = [...e, ...videoYT]

    const options = {}
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options)
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    })

    const onThumbClick = useCallback((index) => {
        if (!emblaMainApi || !emblaThumbsApi) return
        emblaMainApi.scrollTo(index)
    }, [emblaMainApi, emblaThumbsApi])

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return
        setSelectedIndex(emblaMainApi.selectedScrollSnap())
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap())
    }, [emblaMainApi, emblaThumbsApi])

    useEffect(() => {
        if (!emblaMainApi) return
        onSelect()
        emblaMainApi.on('select', onSelect).on('reInit', onSelect)
    }, [emblaMainApi, onSelect])

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaMainApi)

    const [zoomStyle, setZoomStyle] = useState({})

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect()
        const x = ((e.clientX - left) / width) * 100
        const y = ((e.clientY - top) / height) * 100

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(1.5)"
        })
    }

    const handleMouseLeave = () => {
        setZoomStyle({ transform: "scale(1)" })
    }

    return (
        <div className={styles.atasswipper}>
            {/* Thumbnails */}
            <div className={styles.emblaThumbs}>
                <div className={styles.emblaThumbsViewport} ref={emblaThumbsRef}>
                    <div className={styles.emblaThumbsContainer}>
                        {data?.map((item, index) => (
                            <div
                                key={index}
                                className={
                                    styles.emblaThumbsSlide.concat(
                                        index === selectedIndex ? ` ${styles.emblaThumbsSlideSelected}` : ''
                                    )
                                }
                            >
                                <button
                                    onClick={() => onThumbClick(index)}
                                    type="button"
                                    className={styles.emblaThumbsSlideNumber}
                                >
                                    {item?.secure_url ? (
                                        <Image
                                            src={item?.secure_url}
                                            width={50}
                                            height={50}
                                            alt={productName + ' - Pelangi Teknik' || 'Thumbnail'}
                                        />
                                    ) : (
                                        <div className={styles.videoiconwrapper}>
                                            <div className={styles.ikonyoutube}>
                                                <FaRegCirclePlay color='rgb(234, 234, 234)' size={30} />
                                            </div>
                                            <div className={styles.videoicon}>
                                                <Image
                                                    src={e[0]?.secure_url}
                                                    width={50}
                                                    height={50}
                                                    alt="Thumbnail Video"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
                <span className={styles.prevnext}>
                    <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                    <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                </span>
            </div>

            {/* Main Carousel */}
            <div className={styles.embla}>
                <div className={styles.emblaViewport} ref={emblaMainRef}>
                    <div className={styles.emblaContainer}>
                        {data?.map((item, i) => {
                            const isLastSlide = i === data.length - 1
                            return (
                                <div className={styles.emblaSlide} key={i}>
                                    <div className={styles.emblaSlideNumber}>
                                        <div className={styles.gambaratas}>
                                            {type && <span className={styles.type}>{type.toUpperCase()}</span>}
                                            {item.youtube_id ? (
                                                <YouTubeEmbed url={item.youtube_id} width={'100%'} height={400} />
                                            ) : item.secure_url ? (
                                                <Image
                                                    src={item.secure_url}
                                                    width={1080}
                                                    height={1080}
                                                    alt={productName + ' - Pelangi Teknik' || 'Image Pelangi Teknik'}
                                                    style={{
                                                        width: "100%",
                                                        transition: "transform 0.2s ease-in-out",
                                                        ...zoomStyle,
                                                    }}
                                                    onMouseMove={handleMouseMove}
                                                    onMouseLeave={handleMouseLeave}
                                                />
                                            ) : (
                                                // tampilkan "Video Belum Tersedia" hanya kalau ini slide terakhir
                                                isLastSlide && (
                                                    <div className={styles.videobelumtersedia}>
                                                        <div>Video Belum Tersedia</div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Navigation Buttons & Number Indicator */}
                    {/* {zoomStyle.transform === 'scale(1)' && (
                        <>
                            <div
                                className={styles.emblaButtons}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={handleMouseLeave}
                            >
                                <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
                                <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
                            </div>
                            <div className={styles.number}>
                                {selectedIndex + 1} / {data?.length}
                            </div>
                        </>
                    )} */}
                </div>
            </div>
        </div>
    )
}

export default EmblaCarousel
