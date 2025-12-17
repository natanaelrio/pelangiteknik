import GoogleProvider from "next-auth/providers/google";
import { GetIDCart, UpsertUser } from '@/controllers/cart'
import { randomUUID } from "crypto";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    access_type: "offline",  // ini penting untuk dapat refresh_token
                    prompt: "consent"        // paksa Google kasih refresh_token setiap login
                }
            }
        }),
    ],
    session: {
        strategy: "jwt", // Menggunakan JWT untuk session
    },
    jwt: {
        secret: process.env.NEXTAUTH_SECRET, // Tambahkan secret untuk JWT
    },
    // Callbacks opsional untuk mengontrol token atau session behavior
    callbacks: {
        async signIn({ account, profile }) {
            if (!profile?.email) {
                return null
            }

            await UpsertUser({
                "email": `${profile?.email}`,
                "avatar": `${profile?.picture}`,
                "IDCart": randomUUID(),
                "name": `${profile?.name}`
            })
            return true
        },
        async jwt({ token, account, user }) {
            // console.log(token);
            // console.log(account);

            const data = await GetIDCart(token.email)

            // Tambahkan informasi user atau account ke dalam JWT jika ada
            if (account) {
                token.accessToken = account.access_token;
                token.id = data.IDCart
            }
            return token;
        },
        async session({ session, token }) {
            // console.log(token);
            // console.log(session);

            // Tambahkan akses token dari JWT ke dalam session
            session.accessToken = token.accessToken;
            session.user.id = token.id
            return session;
        },
    }
}