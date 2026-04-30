import { CardDetail } from "./_components/CardDetail";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  return <CardDetail userId={userId} />;
}
