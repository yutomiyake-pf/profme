import { SiteLayout as Layout } from "@/app/_components/Layout/SiteLayout";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Layout>{children}</Layout>;
}
