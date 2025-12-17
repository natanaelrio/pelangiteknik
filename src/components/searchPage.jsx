'use client'
import { useSearchParams } from 'next/navigation'
import ListProduct from "@/components/listProduct";
import { useEffect, useState } from 'react'
import { GetSearch } from '@/controllers/userClient'

export default function SearchPage({ textSearch, FilterCategory, Lfilter }) {
    const searchParams = useSearchParams()
    const search = searchParams.get('search')
    const sub = searchParams.get('sub')
    const type = searchParams.get('type')
    const tag = searchParams.get('tag')
    const [data, setData] = useState([])

    useEffect(() => {
        const dataPencarian = async () => {
            try {
                const res = await GetSearch(search, sub, type, tag);
                setData(res);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        }
        dataPencarian()
    }, [search, sub, type, tag])

    return (
        <ListProduct
            textSearch={search}
            Listdata={data}
            FilterCategory={FilterCategory}
            Lfilter={Lfilter}
        />
    )
}
