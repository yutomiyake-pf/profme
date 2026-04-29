"use client";

import { ReactNode } from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import styles from "./styles.module.css";

type TagVariant = "skill" | "hobby" | "fandom" | "default";

interface Props {
  children: ReactNode;
  variant?: TagVariant;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const Tag = ({
  children,
  variant = "default",
  removable = false,
  onRemove,
  className,
}: Props) => {
  return (
    <span className={clsx(styles.tag, styles[variant], className)}>
      {children}
      {removable && (
        <button
          type="button"
          onClick={onRemove}
          className={styles.removeButton}
          aria-label="タグを削除"
        >
          <IoClose size={12} />
        </button>
      )}
    </span>
  );
};
