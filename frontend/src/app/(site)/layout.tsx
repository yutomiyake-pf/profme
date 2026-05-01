import { SiteLayout as Layout } from "@/app/_components/Layout/SiteLayout";
import { AuthProvider } from "@/app/_providers/AuthProvider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Layout>{children}</Layout>
    </AuthProvider>
  );
}
