import { Avatar } from "@/app/_components/Avatar";
import { Card } from "@/app/_components/Card";
import { Tag } from "@/app/_components/Tag";
import type { Endorsement } from "../../_containers/EndorsementsContainer";
import styles from "./styles.module.css";

interface Props {
  endorsements: Endorsement[];
}

export const EndorsementList = ({ endorsements }: Props) => {
  if (endorsements.length === 0) {
    return <p className={styles.empty}>まだ評価がありません</p>;
  }

  return (
    <div className={styles.list}>
      {endorsements.map((endorsement) => (
        <Card key={endorsement.id} className={styles.endorsementCard} padding="lg">
          <div className={styles.header}>
            <Avatar name={endorsement.authorName} src={endorsement.authorAvatarUrl} size="md" />
            <div className={styles.meta}>
              <p className={styles.authorName}>{endorsement.authorName}</p>
              {endorsement.relationship && (
                <p className={styles.relationship}>{endorsement.relationship}</p>
              )}
            </div>
            {endorsement.approvedAt && (
              <p className={styles.date}>
                {new Date(endorsement.approvedAt).toLocaleDateString("ja-JP")}
              </p>
            )}
          </div>
          <p className={styles.episode}>{endorsement.episode}</p>
          <div className={styles.tags}>
            {endorsement.tags.map((tag) => (
              <Tag key={tag} variant="skill">
                {tag}
              </Tag>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};
