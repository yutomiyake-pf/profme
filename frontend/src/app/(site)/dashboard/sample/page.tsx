import { composePage, withSession } from "@/lib/next";
import { SampleCard } from "./_components/SampleCard";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: false }), async ({ session }) => {
    return <SampleCard isLoggedIn={!!session} />;
  })(props);
}
