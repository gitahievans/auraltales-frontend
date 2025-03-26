import { AuthorLayout } from "@/components/authordashboard/AuthorLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthorLayout>{children}</AuthorLayout>;
}
