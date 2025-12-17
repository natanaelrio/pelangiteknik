import { NextResponse } from "next/server"
import { getToken } from 'next-auth/jwt'
import { Unslugify } from "./utils/unSlugify"
import { Slugify } from "./utils/slugify"
import { UnslugifyMerek } from "./utils/unSlugifyMerek"
import { GetCart } from "./controllers/cart"
import { HandleNotifikasiPerson } from "./service/handleNotifikasiWA"

export async function middleware(request) {
    const url = request.nextUrl
    const url2 = new URL(request.nextUrl);
    url.host = 'www.pelangiteknik.com';
    url.protocol = 'https:';
    url.port = ''; // hapus port 3001

    // await HandleNotifikasiPerson(`6285938552576@c.us`, `🚀 ada kunjungan ${url.href}`)

    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
    const { pathname } = request.nextUrl;

    const dataCart = await GetCart(token?.id || ''); // untuk ngecek apakah token valid atau tidak
    if (request.nextUrl.pathname.startsWith('/cart'))
        if (!token || dataCart.length === 0) {
            return NextResponse.redirect(new URL('/', request.url))
        }
    if (request.nextUrl.pathname.startsWith('/order'))
        if (!token || dataCart.length === 0) {
            return NextResponse.redirect(new URL('/', request.url))
        }

    // if (request.nextUrl.pathname.startsWith('/product/')) {
    //     const slug = pathname.replace("/product/", "");
    //     const dataProduk = await GetProduct(slug)

    //     if (dataProduk.length === 0) {
    //         return NextResponse.redirect(new URL('/contact', request.url))
    //     }
    // }

    if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/product')) {

        const slug = request.nextUrl.pathname.split('/').slice(-1).toString()

        try {
            // UPDATE
            await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/viewProduct?id=${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.NEXT_PUBLIC_SECREET
                },
                next: { revalidate: 0 }
            })
        }
        catch (e) {
            console.log(e);
        }
    }
    if (process.env.NODE_ENV === 'production' && request.nextUrl.pathname.startsWith('/blog')) {

        const slug = request.nextUrl.pathname.split('/').slice(-1).toString()

        try {
            // UPDATE
            await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/a/viewArtikel?id=${slug}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': process.env.NEXT_PUBLIC_SECREET
                },
                next: { revalidate: 0 }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    if (pathname.startsWith('/shop')) {
        return NextResponse.redirect(new URL('/product', request.url))
    }
    // if (pathname.startsWith('/blog')) {
    //     const searchParams = request.nextUrl.searchParams;
    //     return NextResponse.redirect(new URL('/contact', request.url));

    // }

    if (pathname.startsWith('/product')) {
        const searchParams = request.nextUrl.searchParams;

        // langsung trim setiap param agar aman
        const srsltid = searchParams.get("srsltid")?.trim() || "";
        const q = Unslugify(searchParams.get("q"))?.trim() || "";
        const search = searchParams.get("search")?.trim() || "";
        const tag = searchParams.get("tag")?.trim() || "";
        const m = UnslugifyMerek(searchParams.get("m"))?.trim() || "";
        const t = searchParams.get("t")?.trim() || "";
        const take = searchParams.get("take")?.trim() || "";

        // hanya boleh param ini
        // const allowedParams = ["search", "q", "tag", "m", "t", "take", "srsltid"];
        // const keys = [...searchParams.keys()];
        // const adaQueryTidakValid = keys.some(k => !allowedParams.includes(k));

        // if (adaQueryTidakValid) {
        //     return NextResponse.redirect(new URL('/contact', request.url));
        // }

        // kalau hanya ada tag → jadikan q
        if (tag && !q) {
            url.searchParams.delete('tag');
            url.searchParams.set('q', Slugify(tag));
            return NextResponse.redirect(url, 301);
        }

        // kalau hanya ada search → jadikan q
        if (search && !q) {
            url.searchParams.delete('search');
            url.searchParams.set('q', Slugify(search));
            return NextResponse.redirect(url, 301);
        }

        if (tag && !q) {
            url.searchParams.delete('tag');
            url.searchParams.set('q', Slugify(tag));
            return NextResponse.redirect(url, 301);
        }
        if (take && !t) {
            url.searchParams.delete('take');
            url.searchParams.set('t', Slugify(take));
            return NextResponse.redirect(url, 301);
        }
        // kalau hanya ada search → jadikan q
        // if (t > 5) {
        //     url.searchParams.set('t', 5);
        //     return NextResponse.redirect(url, 301);
        // }

        if (m === null) {
            return;
        }
        if (m === '') {
            return;
        }
    }
    if (pathname.startsWith('/search')) {
        const searchParams = request.nextUrl.searchParams;

        // langsung trim setiap param agar aman
        const srsltid = searchParams.get("srsltid")?.trim() || "";
        const q = Unslugify(searchParams.get("q"))?.trim() || "";
        const search = searchParams.get("search")?.trim() || "";
        const tag = searchParams.get("tag")?.trim() || "";
        const m = UnslugifyMerek(searchParams.get("m"))?.trim() || "";
        const t = searchParams.get("t")?.trim() || "";
        const take = searchParams.get("take")?.trim() || "";

        // hanya boleh param ini
        const allowedParams = ["search", "q", "tag", "m", "t", "take", 'srsltid'];
        const keys = [...searchParams.keys()];
        const adaQueryTidakValid = keys.some(k => !allowedParams.includes(k));

        if (adaQueryTidakValid) {
            return NextResponse.redirect(new URL('/contact', request.url));
        }


        // kalau hanya ada tag → jadikan q
        if (tag && !q) {
            url.searchParams.delete('tag');
            url.searchParams.set('q', Slugify(tag));
            return NextResponse.redirect(url, 301);
        }

        // kalau hanya ada search → jadikan q
        if (search && !q) {
            url.searchParams.delete('search');
            url.searchParams.set('q', Slugify(search));
            return NextResponse.redirect(url, 301);
        }

        if (tag && !q) {
            url.searchParams.delete('tag');
            url.searchParams.set('q', Slugify(tag));
            return NextResponse.redirect(url, 301);
        }
        if (take && !t) {
            url.searchParams.delete('take');
            url.searchParams.set('t', Slugify(take));
            return NextResponse.redirect(url, 301);
        }
        // kalau hanya ada search → jadikan q
        if (t > 5) {
            url.searchParams.set('t', 5);
            return NextResponse.redirect(url, 301);
        }

        // kalau ada salah satu (q atau tag atau m) → cek API
        if (q || m) {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_URL_API}/api/p/SProduct?page=1&take=1&m=${m || 'undefined'}&search=${q || ''}&tag=${tag || ''}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
                        },
                        next: { revalidate: 0 }
                    }
                );

                const json = await res.json();
                const kategori = json?.data || [];

                if (kategori.length === 0) {
                    return NextResponse.redirect(new URL('/contact', request.url));
                }
            } catch (err) {
                console.error("Gagal ambil kategori:", err);
            }
        } else {
            // tidak ada query sama sekali → redirect
            return NextResponse.redirect(new URL('/contact', request.url));
        }

        if (m === null) {
            return;
        }
        if (m === '') {
            return;
        }

        // return NextResponse.next()
    }

    // if (pathname.startsWith('/shop') || pathname.startsWith('/product')) {
    //     const searchParams = request.nextUrl.searchParams;
    //     const m = searchParams.get("m")?.trim() || "";
    //     const take = searchParams.get("take")?.trim() || "";
    //     const t = searchParams.get("t")?.trim() || "";
    //     // const allowedParams = ["m", "search", "tag"];
    //     const allowedParams = ["search", "q", "tag", "m", "t", "take"];

    //     // cek apakah ada query yg tidak diijinkan
    //     const keys = [...searchParams.keys()];
    //     const adaQueryTidakValid = keys.some(k => !allowedParams.includes(k));

    //     if (adaQueryTidakValid) {
    //         return NextResponse.redirect(new URL('/contact', request.url));
    //     }

    //     if (take && !t) {
    //         url.searchParams.delete('take');
    //         url.searchParams.set('t', take);
    //         return NextResponse.redirect(url, 301);
    //     }
    //     // kalau pure /shop → lanjut tanpa redirect
    //     if (m === null) {
    //         return;
    //     }
    //     if (m === '') {
    //         return;
    //     }

    //     // kalau m ada tapi kosong → redirect
    //     if (m !== null && m.trim() === "") {
    //         return NextResponse.redirect(new URL('/contact', request.url));
    //     }

    //     // kalau m valid → fetch API
    //     try {
    //         const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/SProduct?page=1&take=1&m=${m}&search=${Unslugify(searchParams.get("q")) || ''}&tag=${Unslugify(searchParams.get("tag")) || ''}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
    //             },
    //             next: { revalidate: 0 }
    //         });

    //         const json = await res.json();
    //         const kategori = json?.data || [];

    //         if (kategori.length === 0) {
    //             return NextResponse.redirect(new URL('/contact', request.url));
    //         }
    //     } catch (err) {
    //         console.error("Gagal ambil kategori:", err);
    //     }
    // }

    if (request.nextUrl.pathname.startsWith('/category')) {
        const searchParams = request.nextUrl.searchParams;
        const take = searchParams.get("take")?.trim() || "";
        const t = searchParams.get("t")?.trim() || "";

        if (take && !t) {
            url.searchParams.delete('take');
            url.searchParams.set('t', take);
            return NextResponse.redirect(url, 301);
        }
    }



}
export const config = {
    matcher: ['/', '/category/:path*', '/category/:path', '/shop', '/product/:path*', '/search/:path*', '/cart/:path*'],
}