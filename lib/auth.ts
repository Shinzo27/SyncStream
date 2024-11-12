import NextAuth from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";

export const NEXT_AUTH = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "",
    callbacks: {
        async jwt({ token, user }:any) {
            if (user) {
                token.user = user;
            }
            return token;
        },
        async session({ session, token }:any) {
            session.user = token.user;
            return session;
        },
    },
    pages: {
        signIn: "/signin",
        signUp: "/signup",
    }
}