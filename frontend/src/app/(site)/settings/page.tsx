import { composePage, withSession } from "@/lib/next";
import { Settings } from "./_components/Settings";
import { PageContainer } from "./_containers/PageContainer";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: true }), async () => {
    return (
      <PageContainer>
        {({ initialVisibility }) => <Settings initialVisibility={initialVisibility} />}
      </PageContainer>
    );
  })(props);
}
