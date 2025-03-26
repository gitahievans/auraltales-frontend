import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      image?: string;
      name?: string;
      is_staff: boolean;
      is_author: boolean;
      is_active: boolean;
      date_joined: string;
    };
    token: { jwt: string };
    refreshToken: string;
  }

  interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    jwt: string;
    refresh: string;
    profile?: {
      phone_number: string;
    };
    image?: string;
    name?: string;
    is_active: boolean;
    is_author: boolean;
    is_staff: boolean;
    date_joined: string;
  }
}
