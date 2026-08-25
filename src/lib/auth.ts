import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "./prisma";
import bcrypt from "bcryptjs";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string | null;
      firstName: string | null;
      lastName: string | null;
      gender: string | null;
      dob: string | null;
      email: string | null;
      phone: string | null;
      image: string | null;
      role: string;
    };
  }
  interface User {
    role: string;
    phone?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone: string | null;
    firstName: string | null;
    lastName: string | null;
    gender: string | null;
    dob: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "email",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) return null;

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            phone: user.phone,
          };
        } catch (error) {
          console.error("[AUTH] Authorize error:", error);
          return null;
        }
      },
    }),
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
            phone: user.phone,
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
        token.phone = user.phone ?? null;
      }
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          select: { name: true, role: true, phone: true, firstName: true, lastName: true, gender: true, dob: true },
        });
        if (dbUser) {
          token.name = dbUser.name;
          token.role = dbUser.role;
          token.phone = dbUser.phone;
          token.firstName = dbUser.firstName;
          token.lastName = dbUser.lastName;
          token.gender = dbUser.gender;
          token.dob = dbUser.dob?.toISOString() || null;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.gender = token.gender;
        session.user.dob = token.dob;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};
