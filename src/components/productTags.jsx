"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HandlePickExtraWord from "@/utils/handlePickExtraWord";
import { Slugify } from "@/utils/slugify";

export default function ProductTags({ dataTag }) {
    const [randomWords, setRandomWords] = useState([]);

    useEffect(() => {
        const tags = dataTag.split(",");
        const generated = tags.map((item) => ({
            tag: item,
            word: HandlePickExtraWord(item),
        }));
        setRandomWords(generated);
    }, [dataTag]); // hanya dijalankan ulang kalau dataTag berubah

    return (
        <div style={{ marginTop: "20px", height: "100px", overflow: "hidden" }}>
            Tag:
            <p>
                {dataTag.split(",").map((item, index) => (
                    <Link href={`/search?q=${Slugify(item)}`} key={index}>
                        <span
                            style={{
                                display: "inline",
                                marginRight: "5px",
                                fontSize: "var(--font1)",
                                textDecoration: "underline",
                            }}
                        >
                            {`${item},`}
                        </span>
                    </Link>
                ))}
            </p>

            {/* contoh penggunaan randomWords */}
            <p>
                {randomWords.map(({ tag, word }, index) => (
                    <Link href={`/search?q=${Slugify(tag)}`} key={index}>
                        <span
                            style={{
                                display: "inline",
                                marginRight: "5px",
                                fontSize: "var(--font1)",
                                textDecoration: "underline",
                            }}
                        >
                            {`Jual ${tag} ${word},`}
                        </span>
                    </Link>
                ))}
            </p>

            <p>
                {randomWords.map(({ tag, word }, index) => (
                    <Link href={`/search?q=${Slugify(tag)}`} key={index}>
                        <span
                            style={{
                                display: "inline",
                                marginRight: "5px",
                                fontSize: "var(--font1)",
                                textDecoration: "underline",
                            }}
                        >
                            {`Harga ${tag} ${word},`}
                        </span>
                    </Link>
                ))}
            </p>
        </div>
    )
}
