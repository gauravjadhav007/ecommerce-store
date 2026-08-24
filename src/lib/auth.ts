import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      email: string | null;
      phone: string | null;
      image: string | null;
      role: string;
    };
  }
  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        otpVerified: { label: "OTP Verified", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.phone || credentials.otpVerified !== "true") return null;

        const phone = credentials.phone;

        try {
          let user = await prisma.user.findUnique({
            where: { phone },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                phone,
                name: `User ${phone.slice(-4)}`,
              },
            });
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          console.error("[AUTH] Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { name: true, role: true },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
