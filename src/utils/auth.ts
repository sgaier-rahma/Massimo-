import { id } from './../../node_modules/next-auth/client/__tests__/helpers/mocks.d';
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions, User, getServerSession } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./connect";

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string;
      type: string;
    };
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    type: string;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({

      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.type = token.type;
      }
      return session;
    },
    async jwt({ token }) {
      const userInDb = await prisma.user.findUnique({
        where: {
          email: token.email!,
        },
      });
      token.id = userInDb?.id!;
      token.type = userInDb?.type!;
      return token;
    },
  },
};

export const getAuthSession = () => getServerSession(authOptions);
