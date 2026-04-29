import Image from "next/image";
import clsx from "clsx";
import styles from "./styles.module.css";

type AvatarSize = "sm" | "md" | "lg" | "xl";

interface Props {
  src?: string | null;
  name: string;
  size?: AvatarSize;
  className?: string;
}

const sizeMap: Record<AvatarSize, number> = {
  sm: 32,
  md: 48,
  lg: 64,
  xl: 96,
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

export const Avatar = ({ src, name, size = "md", className }: Props) => {
  const dimension = sizeMap[size];

  return (
    <div
      className={clsx(styles.avatar, styles[size], className)}
      style={{ width: dimension, height: dimension }}
    >
      {src ? (
        <Image
          src={src}
          alt={`${name}のアバター`}
          width={dimension}
          height={dimension}
          className={styles.image}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
};
