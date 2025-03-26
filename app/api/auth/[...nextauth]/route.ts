import NextAuth from "next-auth";
import { nextAuthOptions } from "@/lib/nextauthOptions";

export const runtime = "edge";

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
