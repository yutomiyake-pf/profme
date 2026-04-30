import clsx from "clsx";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { FiExternalLink } from "react-icons/fi";
import { Avatar } from "@/app/_components/Avatar";
import { Tag } from "@/app/_components/Tag";
import type { CardTheme } from "@/constants/cardTheme";
import styles from "./styles.module.css";

interface CustomLink {
  title: string;
  url: string;
}

interface Profile {
  displayName: string;
  university?: string;
  faculty?: string;
  grade?: string;
  bio?: string;
  gakuchika?: string;
  avatarUrl?: string | null;
  cardTheme: CardTheme;
  skills?: string[];
  hobbies?: string[];
  qualifications?: string[];
  snsLinks?: {
    twitter?: string | null;
    instagram?: string | null;
    github?: string | null;
    linkedin?: string | null;
  };
  customLinks?: CustomLink[];
}

interface Props {
  profile: Profile;
}

export const FullBusinessCard = ({ profile }: Props) => {
  const theme = profile.cardTheme || "navy";
  const hasTags =
    (profile.skills?.length ?? 0) > 0 ||
    (profile.hobbies?.length ?? 0) > 0 ||
    (profile.qualifications?.length ?? 0) > 0;

  return (
    <div className={clsx(styles.card, styles[theme])}>
      <div className={styles.accentLine} />
      <div className={styles.content}>
        <div className={styles.header}>
          <Avatar src={profile.avatarUrl} name={profile.displayName} size="xl" />
          <div className={styles.info}>
            <h1 className={styles.name}>{profile.displayName}</h1>
            {profile.university && (
              <p className={styles.affiliation}>
                {profile.university}
                {profile.faculty && ` ${profile.faculty}`}
                {profile.grade && ` ${profile.grade}`}
              </p>
            )}
          </div>
        </div>

        {profile.bio && <p className={styles.bio}>{profile.bio}</p>}

        {profile.gakuchika && (
          <div className={styles.gakuchika}>
            <span className={styles.sectionLabel}>Gakuchika</span>
            <p className={styles.gakuchikaText}>{profile.gakuchika}</p>
          </div>
        )}

        {hasTags && (
          <div className={styles.tagsContainer}>
            {profile.skills && profile.skills.length > 0 && (
              <div className={styles.tagGroup}>
                <span className={styles.sectionLabel}>Skills</span>
                <div className={styles.tags}>
                  {profile.skills.map((skill) => (
                    <Tag key={skill} variant="skill">
                      {skill}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {profile.hobbies && profile.hobbies.length > 0 && (
              <div className={styles.tagGroup}>
                <span className={styles.sectionLabel}>Hobbies</span>
                <div className={styles.tags}>
                  {profile.hobbies.map((hobby) => (
                    <Tag key={hobby} variant="hobby">
                      {hobby}
                    </Tag>
                  ))}
                </div>
              </div>
            )}

            {profile.qualifications && profile.qualifications.length > 0 && (
              <div className={styles.tagGroup}>
                <span className={styles.sectionLabel}>Qualifications</span>
                <div className={styles.tags}>
                  {profile.qualifications.map((qualification) => (
                    <Tag key={qualification} variant="qualification">
                      {qualification}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className={styles.links}>
          {profile.snsLinks?.twitter && (
            <a
              href={profile.snsLinks.twitter}
              className={styles.socialLink}
              aria-label="X (Twitter)"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaXTwitter size={20} />
            </a>
          )}
          {profile.snsLinks?.instagram && (
            <a
              href={profile.snsLinks.instagram}
              className={styles.socialLink}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram size={20} />
            </a>
          )}
          {profile.snsLinks?.github && (
            <a
              href={profile.snsLinks.github}
              className={styles.socialLink}
              aria-label="GitHub"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub size={20} />
            </a>
          )}
          {profile.snsLinks?.linkedin && (
            <a
              href={profile.snsLinks.linkedin}
              className={styles.socialLink}
              aria-label="LinkedIn"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedinIn size={20} />
            </a>
          )}
        </div>

        {profile.customLinks && profile.customLinks.length > 0 && (
          <div className={styles.customLinks}>
            <span className={styles.sectionLabel}>Links</span>
            <div className={styles.customLinksList}>
              {profile.customLinks.map(
                (link, index) =>
                  link.url && (
                    <a
                      key={index}
                      href={link.url}
                      className={styles.customLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiExternalLink size={14} />
                      {link.title || link.url}
                    </a>
                  ),
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
