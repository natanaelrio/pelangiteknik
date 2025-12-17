export function Slugify(input) {
    if (!input && input !== 0) return '';

    return String(input)
        // Normalisasi dan buang aksen (é -> e)
        .normalize('NFD')
        .replace(/\p{Diacritic}/gu, '')
        // Lowercase semua
        .toLowerCase()
        // Trim spasi di awal/akhir
        .trim()
        // Ganti spasi, plus, underscore, dan tanda pemisah lain menjadi satu tanda hubung
        .replace(/[\s+_]+/g, '-')
        // Buang karakter selain huruf, angka, dan tanda hubung
        .replace(/[^a-z0-9-]/g, '')
        // Ganti banyak tanda hubung jadi satu
        .replace(/-+/g, '-');
}