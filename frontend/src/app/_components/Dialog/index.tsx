"use client";

import { MouseEvent, ReactNode, forwardRef, useImperativeHandle, useRef } from "react";
import clsx from "clsx";
import { IoClose } from "react-icons/io5";
import styles from "./styles.module.css";

export interface DialogHandle {
  open: () => void;
  close: () => void;
}

interface Props {
  children: ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

export const Dialog = forwardRef<DialogHandle, Props>(
  ({ children, showCloseButton = false, className }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => dialogRef.current?.showModal(),
      close: () => dialogRef.current?.close(),
    }));

    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === e.currentTarget) dialogRef.current?.close();
    };

    return (
      <dialog
        ref={dialogRef}
        className={clsx(styles.dialog, className)}
        onClick={handleBackdropClick}
      >
        {showCloseButton && (
          <button
            type="button"
            className={styles.closeButton}
            onClick={() => dialogRef.current?.close()}
            aria-label="閉じる"
          >
            <IoClose size={24} />
          </button>
        )}
        {children}
      </dialog>
    );
  },
);

Dialog.displayName = "Dialog";
