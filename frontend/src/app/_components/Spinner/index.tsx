import clsx from "clsx";
import styles from "./styles.module.css";

type SpinnerSize = "sm" | "md" | "lg";

interface Props {
  size?: SpinnerSize;
  /** スピナー単独 (中央配置 wrapper を付けない) で出したい時に true */
  inline?: boolean;
  className?: string;
  label?: string;
}

export const Spinner = ({
  size = "md",
  inline = false,
  className,
  label = "読み込み中",
}: Props) => {
  const dot = (
    <span
      className={clsx(styles.spinner, styles[size], !inline && className)}
      role="status"
      aria-label={label}
    />
  );
  if (inline) return dot;
  return <div className={clsx(styles.wrapper, className)}>{dot}</div>;
};
