import {
  DefaultSession,
  User as AuthUser,
  AdapterUser as CoreAdapterUser,
} from "@auth/core/types";
import { AdapterUser as CoreAdapterUserType } from "@auth/core/adapters";

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
      emailVerified?: Date | null;
      first_name?: string;
      last_name?: string;
      phone_number?: string;
    };
    jwt: string;
    refreshToken: string;
  }

  interface User extends AuthUser {
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

  interface AdapterUser extends CoreAdapterUserType {
    id: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    image?: string;
    name?: string;
    is_staff: boolean;
    is_author: boolean;
    is_active: boolean;
    date_joined: string;
    emailVerified?: Date | null;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    jwt?: string; // Add jwt as an optional property
    refresh?: string; // Add refresh as an optional property
  }
}
