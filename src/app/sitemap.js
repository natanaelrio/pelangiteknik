
import { GetKategoriSiteMap, GetSitemap } from "@/controllers/userNew";

export default async function sitemap() {
    const dataListProduct = await GetSitemap()
    const dataSiteMapKategori = await GetKategoriSiteMap()
    const data = dataListProduct

    const utama = [
        {
            url: process.env.NEXT_PUBLIC_URL,
            lastModified: new Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}/about`,
            lastModified: new Date()
        },
        // {
        //     url: `${process.env.NEXT_PUBLIC_URL}/shop`,
        //     lastModified: new Date()
        // },
        {
            url: `${process.env.NEXT_PUBLIC_URL}/product`,
            lastModified: new Date()
        },
        {
            url: `${process.env.NEXT_PUBLIC_URL}/blog`,
            lastModified: new Date()
        }
    ]

    const awalkategori = dataSiteMapKategori.data.map((datautama) => {
        return (
            datautama.categoryProduct.map((data) => {
                return ({
                    url: process.env.NEXT_PUBLIC_URL + '/category/' + datautama.slugCategory + '/' + data?.slugCategory,
                    slug: data?.slugCategory,
                    id: data?.categoryProductUtamaId
                })
            })
        )
    })

    const akhirKategori = awalkategori.flat().map((data) => {
        return (
            {
                url: `${data.url}`,
                lastModified: new Date()
            }
        )
    })

    const listProducts = data.map((data) => {
        return (
            {
                url: `${process.env.NEXT_PUBLIC_URL}/product/${data.slugProduct}`,
                lastModified: new Date()
            }
        )
    })

    return [...utama, ...akhirKategori, ...listProducts]

}