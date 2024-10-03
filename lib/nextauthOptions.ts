import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { pages } from "next/dist/build/templates/app-page";
import { notifications } from "@mantine/notifications";

export const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Enter your password",
        },
      },

      async authorize(credentials) {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }

        const res = await fetch("http://127.0.0.1:8000/accounts/login/", {
          method: "POST",
          body: JSON.stringify({
            email: credentials?.email,
            password: credentials?.password,
          }),
          headers: { "Content-Type": "application/json" },
        });

        const user = await res.json();

        if (res.ok && user?.access) {
          return {
            id: credentials.email,
            jwt: user.access,
            refreshToken: user.refresh,
            ...user.user,
          };
        } else {
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        try {
          const res = await fetch(
            "http://127.0.0.1:8000/accounts/google_signup/",
            {
              method: "POST",
              body: JSON.stringify({
                email: user.email,
                first_name: user.name?.split(" ")[0],
                last_name: user.name?.split(" ")[1],
                avatar: user.image,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const result = await res.json();

          if (result?.exists || result.user_created) {
            return true;
          } else {
            return false;
          }
        } catch (error: any) {
          console.error("Error creating user", error);

          notifications.show({
            title: "Error",
            message: `${error}`,
            color: "red",
            position: "top-right",
          });
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          jwt: user.jwt,
          refreshToken: user.refresh,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          phoneNumber: user.profile?.phone_number,
          image: user.image || "",
        };
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        email: token.email as string,
        phoneNumber: token.phoneNumber as string,
        image: token.image as string,
      };
      session.jwt = token.jwt as string;
      session.refreshToken = token.refreshToken as string;

      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },
};
