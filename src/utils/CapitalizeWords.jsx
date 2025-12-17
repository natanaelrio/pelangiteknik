export function CapitalizeWords(str) {
    return str
        .trim() // hapus spasi depan & belakang
        .split(/\s+/) // pecah berdasarkan spasi
        .map(word => {
            if (word.toLowerCase() === "kva") {
                return "KVA"
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(" ");
}