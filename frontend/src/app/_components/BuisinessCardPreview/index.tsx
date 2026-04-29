import clsx from "clsx";
import { Avatar } from "../Avatar";
import { Tag } from "../Tag";
import styles from "./styles.module.css";

type CardTheme =
  | "navy"
  | "rose"
  | "forest"
  | "gold"
  | "mono"
  | "ocean"
  | "sunset"
  | "lavender"
  | "mint"
  | "charcoal";

interface Profile {
  displayName: string;
  university?: string;
  faculty?: string;
  grade?: string;
  bio?: string;
  avatarUrl?: string;
  skills?: string[];
  hobbies?: string[];
  fandoms?: string[];
}

interface Props {
  theme?: CardTheme;
  profile: Profile;
  compact?: boolean;
  className?: string;
}

export const BusinessCardPreview = ({
  theme = "navy",
  profile,
  compact = false,
  className,
}: Props) => {
  return (
    <div className={clsx(styles.card, styles[theme], compact && styles.compact, className)}>
      <div className={styles.accentLine} />
      <div className={styles.content}>
        <div className={styles.header}>
          <Avatar src={profile.avatarUrl} name={profile.displayName} size={compact ? "sm" : "lg"} />
          <div className={styles.info}>
            <h3 className={styles.name}>{profile.displayName}</h3>
            {profile.university && (
              <p className={styles.affiliation}>
                {profile.university}
                {profile.faculty && ` ${profile.faculty}`}
                {profile.grade && ` ${profile.grade}`}
              </p>
            )}
          </div>
        </div>
        {!compact && (
          <>
            {profile.bio && <p className={styles.bio}>{profile.bio}</p>}
            {profile.skills && profile.skills.length > 0 && (
              <div className={styles.tags}>
                {profile.skills.slice(0, 3).map((skill) => (
                  <Tag key={skill} variant="skill">
                    {skill}
                  </Tag>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
