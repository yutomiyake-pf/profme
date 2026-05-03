import { CardDetail } from "./_components/CardDetail";
import { PageContainer } from "./_containers/PageContainer";

interface Props {
  params: Promise<{ userId: string }>;
}

export default async function Page({ params }: Props) {
  const { userId } = await params;
  return (
    <PageContainer userId={userId}>{(cardProps) => <CardDetail {...cardProps} />}</PageContainer>
  );
}
