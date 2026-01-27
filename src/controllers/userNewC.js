export const GetKategori = async (page) => {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/p/getkategori`, {
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
