import { redirect } from "next/navigation";
import { composePage, withSession } from "@/lib/next";
import { Login } from "./_components/Login";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  params: Promise<Record<string, never>>;
}

export default async function Page(props: Props) {
  return composePage(withSession({ requireAuth: false }), async ({ session }) => {
    if (session) {
      redirect("/dashboard");
    }
    return <Login />;
  })(props);
}
