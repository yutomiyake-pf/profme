"use client";

import { ReactNode, ButtonHTMLAttributes } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  disabled,
  className,
  ...props
}: Props) {
  return (
    <button
      className={clsx(
        styles.button,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isLoading && styles.loading,
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? <span className={styles.spinner} aria-hidden="true" /> : null}
      <span className={isLoading ? styles.hiddenText : ""}>{children}</span>
    </button>
  );
}
