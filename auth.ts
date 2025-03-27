// auth.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Utility function to check if JWT is expired
const isExpired = (jwtToken: string): boolean => {
  try {
    const payload = JSON.parse(atob(jwtToken.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch (e) {
    return true; // Treat invalid token as expired
  }
};

// Export the auth methods
export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
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
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile, tokens) {
        console.log("Google profile", profile, tokens);
        return {
          id: profile.sub,
          name: profile.given_name,
          email: profile.email,
          image: profile.picture,
          first_name: profile.given_name,
          last_name: profile.family_name || "",
          phone_number: "",
          jwt: tokens?.access_token || "",
          refresh: tokens?.refresh_token || "",
          is_staff: false,
          is_active: true,
          is_author: false,
          date_joined: new Date().toISOString(),
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("Signin Callback - Start", { user, account, profile });

      if (account?.provider === "google") {
        try {
          const apiUrl =
            process.env.NEXT_PUBLIC_API_URL || "https://api.auratales.com";
          const res = await fetch(`${apiUrl}/accounts/google_signup/`, {
            method: "POST",
            body: JSON.stringify({
              email: user.email,
              first_name: user.name?.split(" ")[0],
              last_name: user.name?.split(" ")[1] || "",
              avatar: user.image,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            const errorText = await res.text();
            console.error("Server response not ok:", errorText);
            return false;
          }

          const result = await res.json();
          console.log("Backend response:", result);

          // Check for an error in the response (e.g., {"detail": "Invalid data"})
          if (result?.detail) {
            console.error("Backend error:", result.detail);
            return false;
          }

          // Check if the response indicates a successful account creation or existing account
          if (result?.access && result?.refresh && result?.user) {
            user.jwt = result.access;
            user.refresh = result.refresh;
            user.first_name = result.user.first_name;
            user.last_name = result.user.last_name;
            user.is_staff = result.user.is_staff;
            user.is_active = result.user.is_active;
            user.is_author = result.user.is_author;
            user.date_joined = result.user.date_joined;
            console.log("Signin Callback - Success", { user });
            return true;
          }

          console.error(
            "Failed to create or verify user account: Invalid response structure",
            result
          );
          return false;
        } catch (error: any) {
          console.error("Error creating user", error);
          return false;
        }
      }

      console.log("Signin Callback - End", { user });
      return true;
    },

    async jwt({ token, user }) {
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

      if (token.jwt && isExpired(token.jwt as string)) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/accounts/token/refresh/`,
            {
              method: "POST",
              body: JSON.stringify({
                refresh: token.refreshToken,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();
          token.jwt = data.access;
          token.refreshToken = data.refresh;
        } catch (error) {
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
        image: token.image ? (token.image as string) : undefined, // Handle optional image
        name: token.name ? (token.name as string) : undefined, // Handle optional name
        is_staff: token.is_staff as boolean,
        is_active: token.is_active as boolean,
        is_author: token.is_author as boolean,
        date_joined: token.date_joined as string,
        emailVerified: null, // Satisfy AdapterUser
        first_name: token.firstName as string, // Map to firstName
        last_name: token.lastName as string, // Map to lastName
        phone_number: token.phoneNumber as string, // Map to phoneNumber
        jwt: token.jwt as string, // Add jwt to satisfy AdapterUser
        refresh: token.refreshToken as string, // Add refresh to satisfy AdapterUser
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
});
