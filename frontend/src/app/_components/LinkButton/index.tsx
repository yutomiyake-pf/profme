import { type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import clsx from "clsx";
import buttonStyles from "../Button/styles.module.css";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "accent";
type ButtonSize = "sm" | "md" | "lg";

interface Props extends Omit<ComponentProps<typeof Link>, "className"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
}

export const LinkButton = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  ...props
}: Props) => {
  return (
    <Link
      className={clsx(
        buttonStyles.button,
        buttonStyles[variant],
        buttonStyles[size],
        fullWidth && buttonStyles.fullWidth,
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
};
