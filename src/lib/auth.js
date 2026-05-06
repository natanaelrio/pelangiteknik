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
                    access_type: "offline",
                    prompt: "consent"
                }
            }
        }),
    ],

    session: {
        strategy: "jwt",
    },

    jwt: {
        secret: process.env.NEXTAUTH_SECRET,
    },

    callbacks: {

        async signIn({ profile }) {
            if (!profile?.email) return false;

            await UpsertUser({
                email: profile.email,
                avatar: profile.picture,
                IDCart: randomUUID(),
                name: profile.name
            });

            return true;
        },

        async jwt({ token, account }) {
            // ambil cart user
            if (token?.email) {
                const data = await GetIDCart(token.email);
                token.id = data?.IDCart;
            }

            // saat login pertama
            if (account) {
                token.accessToken = account.access_token;

                // =========================
                // AUTO EXPIRE JAM 00:00
                // =========================
                const now = new Date();

                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0); // jam 00:00 besok

                const maxAge = Math.floor((midnight - now) / 1000);

                token.exp = Math.floor(Date.now() / 1000) + maxAge;
            }

            return token;
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.user.id = token.id;

            // kirim expiry ke frontend
            session.exp = token.exp;

            return session;
        },
    }
};