'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams, usePathname } from 'next/navigation'
import { useRouter } from 'nextjs-toploader/app'
import { CiFilter } from 'react-icons/ci'
import { IoIosArrowDropright } from 'react-icons/io'
import { MdOutlineSimCardDownload } from 'react-icons/md'
import toast from 'react-hot-toast'

// Components
import LoadingList from '@/components/skleton/loadingList'
import JudulPencarian from '@/components/judulPencarian'

// Controllers
import { GetProductClient } from '@/controllers/userClient'

// Utils
import convertToRupiah from '@/utils/ConvertRupiah'
import useWindowDimensions from '@/utils/getWindowDimensions'
import { Slugify } from '@/utils/slugify'
import { UnslugifyMerek } from '@/utils/unSlugifyMerek'
import { Unslugify } from '@/utils/unSlugify'

// Store & Services
import { useStore } from '@/zustand/zustand'
import { sendGAEventL } from '@/lib/ga'

// Styles
import styles from '@/components/listProduct.module.css'

// Constants
const PAGE_SIZE = 7
const MAX_PRODUCT_PAGES = 9

/**
 * Get display count based on pathname
 */
function getDisplayCount(res, pathname, baseCategory) {
    if (baseCategory === '/category/') {
        return Math.min(res?.totalProduct || 0, res?.data?._count?.listProducts || 0)
    }
    if (pathname === '/search') {
        return Math.min(res?.totalProduct || 0, res?.totalMaxProduct || 0)
    }
    if (pathname === '/product') {
        return Math.min(res?.totalProduct || 0, res?.totalMaxProduct || 0)
    }
    return res?.totalProduct || 0
}

/**
 * Get total products based on pathname
 */
function getTotalCount(res, pathname, baseCategory) {
    if (baseCategory === '/category/') {
        return res?.data?._count?.listProducts || 0
    }
    if (pathname === '/search' || pathname === '/product') {
        return res?.totalMaxProduct || 0
    }
    return res?.totalProduct || 0
}

/**
 * ProductCard Component - Renders individual product card
 */
function ProductCard({ product, index, angka, loadingSlug, onPenawaran }) {
    const productType = product?.productType?.toUpperCase() || ''
    const isThisLoading = loadingSlug === product?.slugProduct

    return (
        <div className={styles.kotak}>
            <div>
                <Link href={`/product/${product?.slugProduct}`}>
                    <div className={styles.gambarbawah}>
                        <Image
                            src={
                                product?.imageProductUtama?.secure_url ||
                                product?.imageProductUtama ||
                                `${process.env.NEXT_PUBLIC_URL}/notfoundicon.jpg`
                            }
                            alt={product?.productName}
                            width={250}
                            height={250}
                        />
                        <div className={styles.typemerek}>
                            <span
                                className={styles.fMerek}
                                dangerouslySetInnerHTML={{
                                    __html: product?.highlight?.productType || productType,
                                }}
                            />
                        </div>
                    </div>
                    <div
                        className={styles.name}
                        dangerouslySetInnerHTML={{
                            __html: product?.highlight?.productName || product?.productName,
                        }}
                    />
                    <div className={styles.price}>
                        {convertToRupiah(Number(product?.productPriceFinal))}
                    </div>
                </Link>
            </div>

            {angka && product?.length && (
                <Link href={`/product/${product?.slugProduct}`}>
                    <div className={styles.angka}>
                        <span className={styles.satu}>TOP {index + 1}</span>
                        <span className={styles.dua} />
                    </div>
                </Link>
            )}

            <div className={styles.bawahdetail}>
                <button
                    disabled={isThisLoading}
                    className={styles.penawaran}
                    onClick={() => onPenawaran(product)}
                >
                    <MdOutlineSimCardDownload /> &nbsp;
                    {isThisLoading ? 'Loading...' : 'Surat Penawaran'}
                </button>
                <div className={styles.penawaran}>
                    <Link href={`/product/${product?.slugProduct}`}>Detail Product</Link>
                </div>
            </div>
        </div>
    )
}

export default function ListProductUser({ angka, Lfilter, res, t, q }) {
    // Hooks
    const { width } = useWindowDimensions()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const bottomRef = useRef(null)

    // Query params
    const m = searchParams.get('m')

    // Conditions
    const isMobileWidth = width <= 1000
    const isProductPage = pathname === '/product'
    const isSearchPage = pathname === '/search'
    const isCategoryPage = pathname.match(/^\/category\//)
    const baseCategory = isCategoryPage ? '/category/' : ''

    // Store
    const setIsPenawaran = useStore((state) => state.setIsPenawaran)
    const setDataPenawaran = useStore((state) => state.setDataPenawaran)
    const setIsLoading = useStore((state) => state.setIsLoading)

    // Local state
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingSlug, setLoadingSlug] = useState(null)
    const [showFilter, setShowFilter] = useState(!isMobileWidth)
    const [filterMerek, setFilterMerek] = useState([])

    // Data initialization effect
    useEffect(() => {
        try {
            setLoading(false)
            if (baseCategory === '/category/') {
                setData(res?.data?.listProducts || [])
            } else if (isSearchPage || isProductPage) {
                setData(res?.data?.data || [])
            }
            setFilterMerek(res?.dataPreviewMerek || [])
        } catch (e) {
            console.error('Error initializing data:', e)
        }
    }, [res, baseCategory, isSearchPage, isProductPage])

    // Analytics effect
    useEffect(() => {
        if (process.env.NODE_ENV === 'production' && q) {
            sendGAEventL('search_view', {
                product_search: q,
                product_link: typeof window !== 'undefined' ? window.location.href : '',
            })
        }
    }, [pathname, q])

    // Load more intersection observer
    useEffect(() => {
        if (loading) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    handleLoadMore()
                }
            },
            { threshold: 1 }
        )

        if (bottomRef.current) {
            observer.observe(bottomRef.current)
        }

        return () => observer.disconnect()
    }, [loading, t])

    // Handlers
    const toggleFilter = () => {
        isMobileWidth ? setShowFilter(!showFilter) : setShowFilter(true)
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handlePenawaran = async (product) => {
        setLoadingSlug(product.slugProduct)
        try {
            const detailedProduct = await GetProductClient(product.slugProduct)
            const { trackEvent } = await import('@/utils/facebookPixel')

            if (process.env.NODE_ENV === 'production') {
                trackEvent('InitiateCheckout', {
                    content_ids: [detailedProduct[0]?.slugProduct],
                    content_type: `${detailedProduct[0]?.user?.categoryProductUtama?.category} - ${detailedProduct[0]?.user?.category}`,
                    value: parseFloat(detailedProduct[0]?.productPriceFinal),
                    currency: 'IDR',
                    num_items: 1,
                })
            }

            setDataPenawaran(detailedProduct[0])
            setIsPenawaran()
        } catch (err) {
            console.error('Error handling penawaran:', err)
            toast.error('Terjadi Kesalahan, Silahkan Coba Lagi')
        } finally {
            setLoadingSlug(null)
        }
    }

    const handleFilter = (filterType, value) => {
        const currentUrl = new URL(window.location.href)
        const params = currentUrl.searchParams

        if (filterType === 'merek') {
            params.set('m', Slugify(value))
        }
        if (isSearchPage && q) {
            params.set('q', Slugify(q))
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handleCloseFilter = (filterType) => {
        const currentUrl = new URL(window.location.href)
        const params = currentUrl.searchParams

        if (filterType === 'merek') {
            params.delete('m')
        }
        if (isSearchPage && q) {
            params.set('q', Slugify(q))
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false })
    }

    const handleLoadMore = () => {
        if (loading) return

        const PAGE = PAGE_SIZE
        const maxLimit =
            baseCategory === '/category/' ? res?.data?._count?.listProducts :
            isSearchPage ? res?.totalMaxProduct :
            isProductPage ? PAGE * MAX_PRODUCT_PAGES :
            Infinity

        if (PAGE * t > maxLimit) return

        setLoading(true)
        const newPage = t + 1
        const currentUrl = new URL(window.location.href)
        currentUrl.searchParams.set('t', newPage)

        router.push(`${currentUrl.pathname}?${currentUrl.searchParams.toString()}`, {
            scroll: false,
        })
    }

    // Calculated values
    const displayCount = getDisplayCount(res, pathname, baseCategory)
    const totalCount = getTotalCount(res, pathname, baseCategory)
    const shouldShowLoadMore =
        baseCategory === '/category/' ? displayCount < res?.data?._count?.listProducts :
        isSearchPage ? displayCount < res?.totalMaxProduct :
        isProductPage ? displayCount < PAGE_SIZE * MAX_PRODUCT_PAGES :
        false
    const hasReachedEnd = PAGE_SIZE * t > (
        baseCategory === '/category/' ? res?.data?._count?.listProducts :
        isSearchPage ? res?.totalMaxProduct :
        isProductPage ? PAGE_SIZE * MAX_PRODUCT_PAGES :
        Infinity
    )


    return (
        <div className={styles.container}>
            <div className={styles.dalamkontainer} style={Lfilter ? { margin: '30px 0', padding: '0 30px' } : {}}>
                {/* Title */}
                {(isProductPage || pathname === '/shop') && <JudulPencarian judul={decodeURIComponent(m)} />}

                <div className={styles.bawah}>
                    {/* Filter Section */}
                    {Lfilter && (
                        <div className={styles.filter}>
                            <span style={{ visibility: 'hidden' }}>d</span>
                            <div className={styles.dalamfilter}>
                                <div className={styles.judul} onClick={toggleFilter}>
                                    <div className={styles.text}>Merek</div>
                                    <div className={styles.icon}>
                                        <CiFilter />
                                    </div>
                                </div>

                                {m ? (
                                    <div className={styles.filternya}>
                                        <div className={styles.box}>{UnslugifyMerek(m)}</div>
                                        <div
                                            className={styles.close}
                                            onClick={() => handleCloseFilter('merek')}
                                        >
                                            ×
                                        </div>
                                    </div>
                                ) : (
                                    showFilter && (
                                        <div className={styles.kategori}>
                                            {filterMerek?.map((brand, idx) => {
                                                if (!brand?.name) return null
                                                if (brand?._count?.Merek === 0) return null

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={styles.list}
                                                        onClick={() => handleFilter('merek', brand.name)}
                                                    >
                                                        <label className={styles.checkboxLabel}>
                                                            <input
                                                                type="checkbox"
                                                                className={styles.checkbox}
                                                                onChange={() => handleFilter('merek', brand.name)}
                                                            />
                                                            <span className={styles.text}>{brand.name}</span>
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className={styles.listproduct}>
                        {/* Search Info */}
                        {Lfilter && (
                            <div className={styles.searchInfo}>
                                {res?.suggest?.[0] ? (
                                    <>
                                        tidak dapat menemukan hasil untuk{' '}
                                        <b className={styles.keyword}>"{Unslugify(q)}"</b>.
                                        <br />
                                        Menampilkan hasil untuk{' '}
                                        <b className={styles.suggest}>
                                            "<h1 className={styles.inlineH1}>{res.suggest[0]}</h1>"
                                        </b>{' '}
                                        {displayCount} dari {totalCount}
                                    </>
                                ) : (
                                    !isProductPage && (
                                        <>
                                            Menampilkan hasil untuk{' '}
                                            <b className={styles.suggest}>
                                                "<h1 className={styles.inlineH1}>{Unslugify(q)}</h1>"
                                            </b>{' '}
                                            {displayCount} dari {totalCount}
                                        </>
                                    )
                                )}
                            </div>
                        )}

                        {!Lfilter && (
                            <span className={styles.angkatotal}>
                                Menampilkan {displayCount} dari {totalCount}
                            </span>
                        )}

                        {/* Product Cards Grid */}
                        <div className={styles.grid}>
                            {data?.length ? (
                                data.map((product, idx) => (
                                    <ProductCard
                                        key={idx}
                                        product={product}
                                        index={idx}
                                        angka={angka}
                                        loadingSlug={loadingSlug}
                                        onPenawaran={handlePenawaran}
                                    />
                                ))
                            ) : (
                                <LoadingList />
                            )}

                            {/* Load More / Back to Top Button */}
                            {data?.length > 0 && (
                                <div
                                    className={styles.kotak}
                                    onClick={hasReachedEnd ? scrollToTop : handleLoadMore}
                                >
                                    <div className={styles.loadmore}>
                                        <div style={hasReachedEnd ? { transform: 'rotate(-95deg)' } : {}}>
                                            <IoIosArrowDropright size={40} />
                                        </div>
                                        <div>
                                            {hasReachedEnd ? 'Kembali Ke atas' : loading ? 'Loading...' : 'Load More'}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div ref={bottomRef} className="h-10" />
                    </div>
                </div>
            </div>
        </div>
    )
}
