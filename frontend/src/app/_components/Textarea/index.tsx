"use client";

import {
  type ChangeEvent,
  type TextareaHTMLAttributes,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
    { label, error, hint, maxLength, showCount = false, id, onChange, className, ...props },
    ref,
  ) => {
    const textareaId = id || `textarea-${label?.replace(/\s/g, "-").toLowerCase()}`;

    const innerRef = useRef<HTMLTextAreaElement | null>(null);
    const [length, setLength] = useState(() =>
      typeof props.value === "string" ? props.value.length : 0,
    );

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    // RHF register 経由 (uncontrolled) で ref から defaultValue が流し込まれた後の長さを反映
    useEffect(() => {
      if (innerRef.current) setLength(innerRef.current.value.length);
    }, []);

    useEffect(() => {
      if (typeof props.value === "string") setLength(props.value.length);
    }, [props.value]);

    const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setLength(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
            {props.required && <span className={styles.required}>*</span>}
          </label>
        )}
        <textarea
          ref={setRefs}
          id={textareaId}
          className={clsx(styles.textarea, error && styles.textareaError, className)}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          maxLength={maxLength}
          onChange={handleChange}
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
              {length}/{maxLength}
            </span>
          )}
        </div>
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
