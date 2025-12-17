'use client'
import { useRouter } from 'next/navigation'
import { useStore } from "@/zustand/zustand";

const CustomLink = ({ href, arialabel, children, back }) => {
    const router = useRouter()
    const setProductMelayangHeader = useStore((state) => state.setProductMelayangHeader)

    const HandleKlik = () => {
        back == 'back' ? router.back() : router.push(href)
        setProductMelayangHeader(false)
    }
    return (
        <div
            style={{ cursor: 'pointer' }}
            aria-label={arialabel ? arialabel : 'no-label'}
            onClick={HandleKlik}>
            {children}
        </div>
    )
}

export default CustomLink;