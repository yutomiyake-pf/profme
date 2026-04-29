import { ReactNode } from "react";
import styles from "./styles.module.css";

type Props = {
  children: ReactNode;
};

export const SiteLayout = ({ children }: Props) => {
  return <div className={styles.container}>{children}</div>;
};
