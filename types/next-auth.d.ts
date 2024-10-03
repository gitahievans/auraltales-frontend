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
    };
    jwt: string; 
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
  }
}
