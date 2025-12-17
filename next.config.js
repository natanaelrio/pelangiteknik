/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: false,
    images: {
        domains: [
            'localhost:3000',
            'localhost',
            'amazonaws.com',
            'tsuzumi-bucket.s3.ap-southeast-1.amazonaws.com',
            'tsuzumi-bucket.s3.amazonaws.com',
            'pelangiteknik.vercel.app',
            'vercel.app',
            'lh3.googleusercontent.com',
            'res.cloudinary.com',
            'pelangiteknik.com',
            'www.pelangiteknik.com',
            'p.pelangiteknik.com',
            'duitku.com',
            'storage.googleapis.com',
            'midtrans.com',
            'dashboard.duitku.com',
            'lh3.googleusercontent.com',
            'googleusercontent.com',
            'res.cloudinary.com',
            'cloudinary.com'
        ],
    }, async headers() {
        return [
            {
                // matching all API routes
                source: "/",
                headers: [
                    { key: "Access-Control-Allow-Credentials", value: "true" },
                    { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                    { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                    { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
                ]
            }
        ]
    }
};
module.exports = nextConfig
