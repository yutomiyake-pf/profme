import { ReactNode } from "react";
import styles from "./styles.module.css";
import { Header } from "../Header";
import { Footer } from "../Footer";

type Props = {
  children: ReactNode;
  enableHeader?: boolean;
  enableFooter?: boolean;
};

export const PageLayout = ({ children, enableHeader = true, enableFooter = true }: Props) => {
  return (
    <div className={styles.container}>
      {enableHeader && <Header />}
      <main className={styles.main}>{children}</main>
      {enableFooter && <Footer />}
    </div>
  );
};
