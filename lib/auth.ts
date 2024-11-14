import NextAuth from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

export const NEXT_AUTH = {
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials:any) {
                console.log(credentials);
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                return { id: credentials.email, name: credentials.email, email: credentials.email, role: "user" };
            },
        })
    ],
    secret: process.env.NEXTAUTH_SECRET || "",
    session: {
        strategy: "jwt",
    },
    callbacks: {
        // async jwt({ token, user, account, profile }:any) {
        //     if (user) {
        //         token.accessToken = account.access_token;
        //         token.id = profile.id;
        //         token.username = profile.login;
        //     }
        //     return token;
        // },
        // async session({ session, token }:any) {
        //     session.user.id = token.user.id;
        //     session.user.name = token.user.name;
        //     session.user.email = token.user.email;
        //     session.user.accessToken = token.accessToken;
        //     return session;
        // },
    },
    pages: {
        signIn: "/signin",
        signUp: "/signup",
    }
}