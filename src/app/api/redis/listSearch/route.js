import redis from "@/lib/redis";

export async function GET(req) {
    try {
        let cursor = "0";
        let keys = [];

        // Ambil semua key dengan prefix "search:"
        do {
            const [nextCursor, found] = await redis.scan(cursor, "MATCH", "search:*", "COUNT", 20);
            keys.push(...found);
            cursor = nextCursor;
        } while (cursor !== "0");

        // Ambil teks di tengah antara "search:" dan ":m:"
        const gensetNames = keys.map(k => {
            const match = k.match(/^search:(.*?):m:/);
            return match ? match[1] : null;
        }).filter(Boolean);

        // Hilangkan duplikat
        const unique = [...new Set(gensetNames)];

        return Response.json({ results: unique });
    } catch (error) {
        console.error("Redis error:", error);
        return Response.json({ error: error.message }, { status: 500 });
    }
}
