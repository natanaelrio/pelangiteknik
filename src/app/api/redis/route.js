import redis from "@/lib/redis";

export async function GET(req, res) {
    try {
        // Simpan data ke Redis
        await redis.set("hello", "world");
        const value = await redis.get("hello");

        return Response.json({
            success: true,
            message: "✅ Connected to Redis",
            value,
        });
    } catch (error) {
        console.error("❌ Redis error:", error);
        return Response.json({
            success: false,
            message: "Redis connection failed",
            error: error.message,
        });
    }

}