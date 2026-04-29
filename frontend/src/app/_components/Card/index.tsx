import { ReactNode } from "react";
import styles from "./styles.module.css";

interface Props {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
}

export function Card({ children, className = "", padding = "md", hoverable = false }: Props) {
  return (
    <div
      className={`${styles.card} ${styles[`padding-${padding}`]} ${hoverable ? styles.hoverable : ""} ${className}`}
    >
      {children}
    </div>
  );
}
