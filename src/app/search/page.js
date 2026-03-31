import { cache } from 'react'

// Controllers
import { GetSearchServerElasticSearch } from '@/controllers/userNew'
import { GetSearchRedis } from '@/controllers/redis'

// Components
import ListProductUser from '@/components/listProductUser'
import NotFoundSearch from '@/components/notFoundSearch'

// Utilities
import { Unslugify } from '@/utils/unSlugify'
import { UnslugifyMerek } from '@/utils/unSlugifyMerek'

/**
 * Cache search results to avoid double fetching
 */
const getSearchCached = cache(async (t, limit, m, q) => {
    return await GetSearchServerElasticSearch(t, limit, m, q)
})

/**
 * Month names list for metadata
 */
const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember'
]

/**
 * Get current month and year for SEO metadata
 */
function getCurrentMonthYear() {
    const date = new Date()
    return {
        month: MONTHS[date.getMonth()],
        year: date.getFullYear()
    }
}

/**
 * Generate SEO metadata for search results
 */
export async function generateMetadata({ searchParams }) {
    const q = searchParams.q
    const m = searchParams.m
    const mUnslug = UnslugifyMerek(m)

    const res = await getSearchCached(1, 1, mUnslug, q)
    const { month, year } = getCurrentMonthYear()
    const keyword = Unslugify(res?.suggest?.[0] || q)

    const title = `Jual ${keyword}${mUnslug ? ' ' + mUnslug : ''} - Kualitas Terbaik, Harga Spesial ${month} ${year} & Garansi Resmi - Pelangi Teknik`
    const description = `Temukan berbagai pilihan ${keyword} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`

    const rawImage = res?.data?.data?.[0]?.imageProductUtama
    const image = rawImage ? rawImage : `${process.env.NEXT_PUBLIC_URL}/logo2026.png`
    const canonicalUrl = `${process.env.NEXT_PUBLIC_URL}/search?q=${q}`

    return {
        title,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            type: 'website',
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [image],
        },
    }
}

/**
 * Search Results Page Component
 * Displays search results based on query parameters
 */
export default async function SearchPage({ params, searchParams }) {
    const q = searchParams.q
    const t = Number(searchParams.t) || 1
    const m = UnslugifyMerek(searchParams.m)
    const listSearch = await GetSearchRedis()

    // Fetch search results with caching
    const res = await getSearchCached(t, 7, m, q)

    // Prepare metadata
    const { month, year } = getCurrentMonthYear()
    const keyword = Unslugify(res?.suggest?.[0] || q)
    const title = `Jual ${keyword}${m ? ' ' + m : ''} - Kualitas Terbaik, Harga Spesial ${month} ${year} & Garansi Resmi - Pelangi Teknik`
    const description = `Temukan berbagai pilihan ${keyword} di Pelangi Teknik. Kami menyediakan berbagai produk dan layanan terbaik sesuai kebutuhan Anda.`
    const images = res?.data?.data?.map((item) => item?.imageProductUtama)


    // If search results found
    if (res?.data?.data?.length) {
        return (
            <>
                <head>
                    <script
                        id="product-schema"
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'Product',
                                'title': title,
                                'name': title,
                                'image': images,
                                'description': description,
                            }),
                        }}
                    />
                </head>
                <ListProductUser
                    res={res || []}
                    q={q}
                    m={m}
                    t={t}
                    kataKunci={q}
                    Lfilter={true}
                />
            </>
        )
    }

    // If no results found
    return (
        <NotFoundSearch
            q={q}
            suggest={res?.suggest}
            ListSearch={listSearch}
        />
    )
}