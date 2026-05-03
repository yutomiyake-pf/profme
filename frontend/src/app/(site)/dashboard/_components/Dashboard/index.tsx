"use client";

import { usePathname, useRouter } from "next/navigation";
import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { TabContent, TabList, TabTrigger, Tabs } from "@/app/_components/Tabs";
import { EndorsementRequestsContainer } from "../../_containers/EndorsementRequestsContainer";
import { FollowRequestsContainer } from "../../_containers/FollowRequestsContainer";
import { FollowersContainer } from "../../_containers/FollowersContainer";
import type { MyCardProfile } from "../../_containers/PageContainer";
import { EndorsementRequestTab } from "../EndorsementRequestTab";
import { FollowRequestTab } from "../FollowRequestTab";
import { FollowerTab } from "../FollowerTab";
import { MyCardTab } from "../MyCardTab";
import { DEFAULT_TAB, TAB_QUERY_KEY, TabValue } from "./tabs";
import styles from "./styles.module.css";

interface Props {
  activeTab: TabValue;
  myCard: MyCardProfile;
}

export const Dashboard = ({ activeTab, myCard }: Props) => {
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
        <FollowRequestsContainer>
          {(followRequests) => (
            <EndorsementRequestsContainer>
              {(endorsementRequests) => (
                <FollowersContainer>
                  {(followers) => (
                    <Tabs
                      defaultValue={DEFAULT_TAB}
                      value={activeTab}
                      onValueChange={handleTabChange}
                    >
                      <TabList>
                        <TabTrigger value="mycard">マイカード</TabTrigger>
                        <TabTrigger value="follow-requests" badge={followRequests.total}>
                          フォロー申請
                        </TabTrigger>
                        <TabTrigger
                          value="endorsement-requests"
                          badge={endorsementRequests.total}
                        >
                          評価の承認
                        </TabTrigger>
                        <TabTrigger value="followers">フォロワー</TabTrigger>
                      </TabList>
                      <TabContent value="mycard">
                        <MyCardTab profile={myCard} />
                      </TabContent>
                      <TabContent value="follow-requests">
                        <FollowRequestTab {...followRequests} />
                      </TabContent>
                      <TabContent value="endorsement-requests">
                        <EndorsementRequestTab {...endorsementRequests} />
                      </TabContent>
                      <TabContent value="followers">
                        <FollowerTab {...followers} />
                      </TabContent>
                    </Tabs>
                  )}
                </FollowersContainer>
              )}
            </EndorsementRequestsContainer>
          )}
        </FollowRequestsContainer>
      </div>
    </PageLayout>
  );
};
