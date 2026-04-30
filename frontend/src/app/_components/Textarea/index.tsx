"use client";

import { TextareaHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  maxLength?: number;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  (
    { label, error, hint, maxLength, showCount = false, id, value, className, ...props },
    ref,
  ) => {
    const textareaId = id || `textarea-${label?.replace(/\s/g, "-").toLowerCase()}`;
    const currentLength = typeof value === "string" ? value.length : 0;

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(styles.textarea, error && styles.textareaError, className)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          maxLength={maxLength}
          value={value}
          {...props}
        />
        <div className={styles.footer}>
          {error && (
            <p id={`${textareaId}-error`} className={styles.error} role="alert">
              {error}
            </p>
          )}
          {hint && !error && (
            <p id={`${textareaId}-hint`} className={styles.hint}>
              {hint}
            </p>
          )}
          {showCount && maxLength && (
            <span className={styles.count}>
              {currentLength}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
