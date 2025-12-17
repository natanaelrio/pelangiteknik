export default function ProductSchemaArticle(data) {
    const datac = data?.data
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "NewsArticle",
                    headline: datac?.title,
                    image: [datac?.imageProductArtikel?.[0]?.secure_url],
                    datePublished: datac?.start,
                    dateModified: datac?.end,
                    author: {
                        "@type": "Person",
                        name: datac?.categoryArtikel?.category,
                    },
                    publisher: {
                        "@type": "Organization",
                        name: "PelangiTeknik",
                        logo: {
                            "@type": "ImageObject",
                            url: `${process.env.NEXT_PUBLIC_URL}/logo.png`,
                        },
                    },
                    description: datac?.description,
                })
            }}
        />

    );
}
