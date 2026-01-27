'use server'
import { revalidatePath } from 'next/cache';


// app/api/random-hashtag/route.js
export const GetRandomPenyemangat = async () => {
    const hashtags = [
        "#StayOnFire",
        "#DontBackDown",
        "#KeepTheFaith",
        "#KeepHustling",
        "#KeepSmiling",
        "#KeepImproving",
        "#LetsGo",
        "#StayWinning",
        "#StayBrave",
        "#KeepRising",
        "#StayMotivated",
        "#DontStopNow",
        "#NeverGiveUp",
        "#YoureKillingIt",
        "#KeepItUp",
        "#KeepShining",
        "#StayFocused",
        "#RiseAndGrind",
        "#BelieveInYourself",
        "#GoGetEm",
        "#YouGotThis",
        "#YouCanDoIt",
        "#KeepGoing",
        "#GoForIt",
        "#DontGiveUp",
        "#KeepFighting",
        "#StayStrong",
        "#StayPositive",
        "#HangInThere",
        "#KeepTheSpirit",
        "#LetsWin",
        "#GoHard",
        "#StayGold",
        "#StayWild",
        "#DontStop",
        "#YouSlay",
        "#KeepFire",
        "#OwnIt",
        "#KeepVibe",
    ];

    const random = hashtags[Math.floor(Math.random() * hashtags.length)];

    return {
        hashtag: random
    };
}


export const GetSearchServer = async (page, take, m, search) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/SProduct?page=${page ? page : 1}&take=${take}&m=${m ? m : 'undefined'}&search=${search ? search : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}
export const GetSearchServerElasticSearch = async (page, take, m, search) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/elasticSearch/elasticSearchUser?page=${page ? page : 1}&limit=${take}&m=${m ? m : 'undefined'}&query=${search ? search : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetSumView = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/sumView`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}
export const GetFilterProduct = async () => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/filter`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}
export const GetListKategori = async (data) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/listKategori`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetListProduct = async (page, take, m) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/listProduct?page=${page ? page : 1}&take=${take}&m=${m ? m : 'undefined'}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetProduct = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/product?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetProductBestProduct = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/bestProduct`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetKategoriUtama = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/kategoriUtama?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetKategori = async (page, take, id, m) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/kategori?page=${page ? page : 1}&take=${take}&id=${id}&m=${m ? m : 'undefined'}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetKategoriSiteMap = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/kategoriSitemap`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetKategoriProduct = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/kategoriProduct?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            cache: 'no-store'
        });
        const data = await res.json()
        return data.data[0]
    }
    catch (err) {
        console.log(err);
    }
}

export const GetSitemap = async (page) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/sitemap`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}
export const PostSuratPenawaran = async (dataKu) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/c/suratPenawaran`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            body: JSON.stringify(dataKu),
            next: {
                revalidate: 0
            }
        });
        const data = await res.json()
        return data.data
    }
    catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}


export const GeneratePaymentMid = async (dataKeranjang) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/paymentmidtrans/token`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            body: JSON.stringify(dataKeranjang)
        })
        return response.json()
    } catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GeneratePaymentMidDemo = async (dataKeranjang) => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/paymentmidtransdemo/token`, {
            method: 'POST',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            body: JSON.stringify(dataKeranjang)
        })
        return response.json()
    } catch (err) {
        console.log(err);
    }
    revalidatePath('/')
}

export const GetGoogleMap = async (id) => {
    const placeId = "ChIJjbcYUpv3aS4RwtIAPGcZuZI"; // ganti dengan Place ID tempatmu
    const apiKey = "AIzaSyAD2Xe_OgJBHLBbvCW78ohZzWMPv1-jEFQ";

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=review&key=${apiKey}&language=id  `, {
            // Tidak ada opsi tambahan yang diperlukan
            next: {
                revalidate: 0
            }
        });
        // Mengembalikan hasil dalam format JSON
        return response.json();
    } catch (error) {
        console.error("Gagal mengambil data ulasan dari Google Maps:", error);
    }

}