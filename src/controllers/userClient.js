
export const GetSearch = async (page, take, m, search) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/SProduct?page=${page ? page : 1}&take=${take}&m=${m ? m : 'undefined'}&search=${search ? search : ''}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            cache: 'no-store'
        });
        const data = await res.json()
        return data
    }
    catch (err) {
        console.log(err);
    }
}


export const GetCartClient = async (id) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/cart/getCart?id=${id}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            cache: 'no-store'
        });
        const data = await res.json()

        return data.data
    }
    catch (err) {
        console.log(err);
    }
}

export const GetNumberSalesWA = async (page) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/a/sales?type=wa`, {
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
}
export const GetNumberSalesForm = async (page) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/a/sales?type=form`, {
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
}

// export const GetPriceOngkir = async (e) => {
//     try {
//         const res = await fetch(`https://api.rajaongkir.com/starter/cost`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'key': `${process.env.NEXT_PUBLIC_SECREET_RAJAONGKIR}`
//             },
//             body: JSON.stringify(e),
//             cache: 'no-store'
//         });
//         const data = await res.json()

//         return data
//     }
//     catch (err) {
//         console.log(err);
//     }
// }


