import { composePage, withSession } from "@/lib/next";
import { ProfileEdit } from "./_components/ProfileEdit";
import { PageContainer } from "./_containers/PageContainer";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: true }), async () => {
    return (
      <PageContainer>
        {(initialValues) => <ProfileEdit initialValues={initialValues} />}
      </PageContainer>
    );
  })(props);
}
