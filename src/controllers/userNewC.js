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
