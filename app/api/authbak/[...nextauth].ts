// pages/api/auth/[...nextauth].js
import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import { PrismaAdapter } from '@auth/prisma-adapter';
// @ts-ignore
// import prisma from '../../../prisma';

const prisma = new PrismaClient;

// @ts-ignore
export default NextAuth({
  providers: [
    // @ts-ignore
    Providers.Credentials({
      // The name to display on the sign-in form (e.g., 'Sign in with...')
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      // @ts-ignore
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (user && user.password === credentials.password) {
          return Promise.resolve(user);
        } else {
          return Promise.resolve(null);
        }
      },
    }),
  ],
  // @ts-ignore
  adapter: PrismaAdapter(prisma),
  // pages: {
  //   signIn: '/signin',
  //   signOut: '/signout',
  //   verifyRequest: '/auth/verify-request',
  //   // @ts-ignore
  //   newUser: null,
  // },
});
