export function UnslugifyMerek(input) {
    if (!input && input !== 0) return '';

    return String(input)
        // Hilangkan karakter aneh selain huruf, angka, dan tanda hubung
        .replace(/[^a-z0-9-]/gi, ' ')
        // Ganti tanda hubung atau underscore jadi spasi
        .replace(/[-_]+/g, ' ')
        // Hilangkan spasi berlebih
        .trim()
}
