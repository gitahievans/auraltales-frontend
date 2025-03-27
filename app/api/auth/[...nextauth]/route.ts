// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/auth";

export const runtime = "edge";

export const { GET, POST } = handlers;
