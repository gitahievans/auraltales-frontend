import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { notifications } from "@mantine/notifications";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/accounts/login/`,
          {
            method: "POST",
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );

        const user = await res.json();

        if (res.ok && user?.access) {
          return {
            id: credentials.email,
            jwt: user.access,
            refresh: user.refresh,
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
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Signin Callback", { user, account, profile });

      if (account?.provider === "google") {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/google_signup/`, {
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
          });

          if (!res.ok) {
            console.error("Server response not ok:", await res.text());
            return false;
          }

          const result = await res.json();
          console.log("Backend response:", result);

          if (result?.exists || result.user_created) {
            // Add JWT tokens to the user object
            user.jwt = result.access;
            user.refresh = result.refresh;
            // Add other user data if needed
            user.first_name = result.user.first_name;
            user.last_name = result.user.last_name;
            user.is_staff = result.user.is_staff;
            user.is_active = result.user.is_active;
            user.is_author = result.user.is_author;
            user.date_joined = result.user.date_joined;
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
      // Initial sign-in
      if (user) {
        token.jwt = user.jwt;
        token.refreshToken = user.refresh;
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.firstName = user.first_name;
        token.lastName = user.last_name;
        token.phoneNumber = user.phone_number;
        token.is_staff = user.is_staff;
        token.is_active = user.is_active;
        token.is_author = user.is_author;
        token.date_joined = user.date_joined;
      }

      // Check if access token is expired
      if (token.jwt && isExpired(token.jwt)) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
            {
              refresh: token.refreshToken,
            }
          );
          token.jwt = response.data.access;
          token.refreshToken = response.data.refresh;
        } catch (error) {
          // Refresh failed, clear tokens
          token.jwt = null;
          token.refreshToken = null;
        }
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
        is_staff: token.is_staff as boolean,
        is_active: token.is_active as boolean,
        is_author: token.is_author as boolean,
        date_joined: token.date_joined as string,
      };
      session.jwt = token.jwt as string;
      session.refreshToken = token.refreshToken as string;
      return session;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      return baseUrl;
    },
  },
};

// Utility function to check if JWT is expired
const isExpired = (jwtToken: string): boolean => {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true; // Treat invalid token as expired
  }
};
