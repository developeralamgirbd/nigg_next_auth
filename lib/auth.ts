import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { compare } from "bcrypt"


export const authOptions:NextAuthOptions = {
    //@ts-ignore
   adapter: PrismaAdapter(db),
   session: {
    strategy: 'jwt'
   },
    pages: {
        signIn: "/signin"
    },
    secret: process.env.SECRET, 
    providers: [
        CredentialsProvider({
          // The name to display on the sign in form (e.g. 'Sign in with...')
          name: 'Credentials',
          credentials: {
            email: { label: "Email", type: "email", placeholder: "example@example.com" },
            password: { label: "Password", type: "password" }
            
          },
          async authorize(credentials) {
            // const res = await fetch("/your/endpoint", {
            //   method: 'POST',
            //   body: JSON.stringify(credentials),
            //   headers: { "Content-Type": "application/json" }
            // })
            // const user = await res.json()
      
            if(!credentials?.email || !credentials?.password){
                return null;
            }

            const existingUser = await db.user.findUnique({
                where: { email: credentials?.email}
            })
            if(!existingUser){
                return null;
            }

            const passwordMatch = await compare(credentials?.password, `${existingUser?.password}`  )

            if(!passwordMatch){
                return null;
            }
            
            return {
                id: `${existingUser?.id}`,
                email: existingUser?.email,
                password: existingUser?.password
            }

          }
        })
      ],
    //   callbacks: {
    //     // async signIn(user, account, profile) {
    //     //   return true
    //     // },
    //     //@ts-ignore
    //     async redirect(url, baseUrl) {
    //       return baseUrl
    //     },
    //     // async session(session, user) {
    //     //   return session
    //     // },
    //     // async jwt(token, user, account, profile, isNewUser) {
    //     //   return token
    //     // }
    // }
}