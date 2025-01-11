import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { notifications } from "@mantine/notifications";

export const nextAuthOptions: NextAuthOptions = {
  debug: true,
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
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile) {
        console.log("Google profile", profile);
        return {
          id: profile.sub,
          name: profile.given_name,
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
      console.log("Signin Callback", { user, account, profile });

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

          if (!res.ok) {
            console.error("Server response not ok:", await res.text());
            return false;
          }

          const result = await res.json();
          console.log("Backend response:", result);

          if (result?.exists || result.user_created) {
            return true;
          }

          notifications.show({
            title: "Error",
            message: "Failed to create or verify user account",
            color: "red",
            position: "top-center",
          });

          return false;
        } catch (error: any) {
          console.error("Error creating user", error);

          notifications.show({
            title: "Error",
            message: error.message || "Failed to Authenticate with Google",
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
          name: user.name || "",
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
        name: token.name as string,
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
