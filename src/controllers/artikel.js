export async function GetListArtikel() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/a/listArtikel`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        })
        return res.json()

    } catch (error) {
        console.log(error);
    }
    // revalidatePath('/')
}


export const HandleDetailArtikel = async (id) => {

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_URL_API}/api/a/detailArtikel?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${process.env.NEXT_PUBLIC_SECREET}`
            },
            next: {
                revalidate: 0
            }
        })
        const data = await res.json()
        return data

    } catch (error) {
        console.log(error);
    }
}