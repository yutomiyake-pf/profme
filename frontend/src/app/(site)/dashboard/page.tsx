import { z } from "zod";
import { composePage, withSession, withZodSearchParams } from "@/lib/next";
import { Dashboard } from "./_components/Dashboard";
import { DEFAULT_TAB, TAB_QUERY_KEY, TAB_VALUES } from "./_components/Dashboard/tabs";
import { PageContainer } from "./_containers/PageContainer";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

// 不正な ?tab=... が来てもデフォルトに倒す
const searchParamsSchema = z.object({
  [TAB_QUERY_KEY]: z.enum(TAB_VALUES).catch(DEFAULT_TAB).optional(),
});

export default async function Page(props: Props) {
  return composePage(
    withSession({ requireAuth: true }),
    withZodSearchParams(searchParamsSchema),
    async ({ parsedSearchParams }) => {
      const activeTab = parsedSearchParams[TAB_QUERY_KEY] ?? DEFAULT_TAB;
      return (
        <PageContainer>
          {({ myCard }) => <Dashboard activeTab={activeTab} myCard={myCard} />}
        </PageContainer>
      );
    },
  )(props);
}
