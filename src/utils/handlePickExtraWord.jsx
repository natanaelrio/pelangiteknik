'use client';

export default function HandlePickExtraWord(item) {
    const wordsGeneral = ["desain modern", "bahan berkualitas", "profesional", "solusi handal"];
    const wordsPromo = ["diskon", "promo hari ini"];
    const wordsBrand = ["pelangi teknik"];

    const lowerItem = item.toLowerCase();

    if (lowerItem.includes("promo") || lowerItem.includes("harga")) {
        return wordsGeneral[Math.floor(Math.random() * wordsGeneral.length)];
    } else if (lowerItem.includes("genset")) {
        const choices = [...wordsGeneral, ...wordsBrand];
        return choices[Math.floor(Math.random() * choices.length)];
    } else {
        const choices = [...wordsGeneral, ...wordsPromo];
        return choices[Math.floor(Math.random() * choices.length)];
    }
}
