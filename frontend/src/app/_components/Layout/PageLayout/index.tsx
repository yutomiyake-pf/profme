import { ReactNode } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";
import { Header } from "../Header";
import { Footer } from "../Footer";

type Props = {
  children: ReactNode;
  enableHeader?: boolean;
  enableFooter?: boolean;
  isLoggedIn?: boolean;
};

export const PageLayout = ({
  children,
  enableHeader = true,
  enableFooter = true,
  isLoggedIn = false,
}: Props) => {
  return (
    <div className={styles.container}>
      {enableHeader && <Header isLoggedIn={isLoggedIn} />}
      <main
        className={clsx(
          styles.main,
          enableHeader && styles.withHeader,
          enableFooter && styles.withFooter,
        )}
      >
        {children}
      </main>
      {enableFooter && <Footer />}
    </div>
  );
};
