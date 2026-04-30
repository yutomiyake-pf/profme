"use client";

import { usePathname, useRouter } from "next/navigation";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { TabContent, TabList, TabTrigger, Tabs } from "@/app/_components/Tabs";
import { EndorsementRequestTab } from "../EndorsementRequestTab";
import { FollowRequestTab } from "../FollowRequestTab";
import { FollowerTab } from "../FollowerTab";
import { MyCardTab } from "../MyCardTab";
import { DEFAULT_TAB, TAB_QUERY_KEY, TabValue } from "./tabs";
import styles from "./styles.module.css";

const mockBadges = {
  followRequests: 3,
  endorsementRequests: 2,
};

interface Props {
  activeTab: TabValue;
}

export const Dashboard = ({ activeTab }: Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleTabChange = (next: string) => {
    const params = new URLSearchParams();
    if (next !== DEFAULT_TAB) {
      params.set(TAB_QUERY_KEY, next);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <PageLayout enableFooter={false} isLoggedIn>
      <div className={styles.container}>
        <h1 className={styles.title}>ダッシュボード</h1>
        <Tabs defaultValue={DEFAULT_TAB} value={activeTab} onValueChange={handleTabChange}>
          <TabList>
            <TabTrigger value="mycard">マイカード</TabTrigger>
            <TabTrigger value="follow-requests" badge={mockBadges.followRequests}>
              フォロー申請
            </TabTrigger>
            <TabTrigger value="endorsement-requests" badge={mockBadges.endorsementRequests}>
              評価の承認
            </TabTrigger>
            <TabTrigger value="followers">フォロワー</TabTrigger>
          </TabList>
          <TabContent value="mycard">
            <MyCardTab />
          </TabContent>
          <TabContent value="follow-requests">
            <FollowRequestTab />
          </TabContent>
          <TabContent value="endorsement-requests">
            <EndorsementRequestTab />
          </TabContent>
          <TabContent value="followers">
            <FollowerTab />
          </TabContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};
