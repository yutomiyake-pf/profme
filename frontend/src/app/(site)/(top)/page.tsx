import { composePage, withSession } from "@/lib/next";
import { Top } from "./_components/Top";
import { PageContainer } from "./_containers/PageContainer";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: false }), async ({ session }) => {
    return (
      <PageContainer>
        <Top isLoggedIn={!!session} />
      </PageContainer>
    );
  })(props);
}
