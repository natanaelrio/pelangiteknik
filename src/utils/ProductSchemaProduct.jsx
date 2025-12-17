import { Unslugify } from "./unSlugify";

export default function ProductSchemaProduct(data) {
    const datac = data?.data[0];
    const image = [...[datac?.imageProductUtama], ...datac?.url_image_product].map(img => img?.secure_url)
    return (
        <script
            id="product-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Product",
                    "name": `${datac.productName} - Pelangi Teknik`,
                    "image": image,
                    "description": datac?.descMetaProduct.trim(),
                    "sku": datac?.productType.trim(),

                    // ⭐⭐⭐⭐⭐ Rating Bintang 5
                    // "aggregateRating": {
                    //     "@type": "AggregateRating",
                    //     "ratingValue": "5",
                    //     "reviewCount": String(datac?.viewProduct),  // wajib ada, minimal 1
                    // },
                    "brand": {
                        "@type": "Organization",
                        "name": Unslugify(datac?.fMerek[0]?.name) || "Pelangi Teknik"
                    },
                    // Optional tetapi bagus
                    "offers": {
                        "@type": "Offer",
                        "priceCurrency": "IDR",
                        "price": datac?.productPriceFinal.trim(),
                        "availability": "https://schema.org/InStock",
                        "itemCondition": "https://schema.org/NewCondition",
                        "url": `${process.env.NEXT_PUBLIC_URL}/product/${datac.slugProduct}`
                    }
                }),
            }}
        />
    );
}
