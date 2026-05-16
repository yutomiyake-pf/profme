import { composePage, withSession } from "@/lib/next";
import { Withdraw } from "./_components/Withdraw";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: true }), async () => {
    return <Withdraw />;
  })(props);
}
