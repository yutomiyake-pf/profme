import { Dashboard } from "./_components/Dashboard";
import { TAB_QUERY_KEY, parseTab } from "./_components/Dashboard/tabs";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const raw = params[TAB_QUERY_KEY];
  const activeTab = parseTab(typeof raw === "string" ? raw : undefined);

  return <Dashboard activeTab={activeTab} />;
}
