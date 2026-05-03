"use client";

import { type ReactNode, type RefObject, useEffect, useRef } from "react";
import { type ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export interface PhoneAuthRenderProps {
  recaptchaContainerRef: RefObject<HTMLDivElement | null>;
  sendSms: (phoneE164: string) => Promise<ConfirmationResult>;
}

interface Props {
  children: (props: PhoneAuthRenderProps) => ReactNode;
}

/**
 * Firebase Phone Auth クライアント SDK との通信責務。
 * invisible reCAPTCHA の生成・解放を含む。
 */
export const PhoneAuthContainer = ({ children }: Props) => {
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    // RecaptchaVerifier は同じ DOM 要素に対して二重生成すると例外を投げるため
    // 既に生成済み (StrictMode の二重実行や HMR) の場合は何もしない。
    if (!recaptchaContainerRef.current || verifierRef.current) return;
    verifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
      size: "invisible",
    });
    return () => {
      // verifier はネイティブ DOM (iframe) を裏で抱えているので
      // unmount 時に明示的に clear() しないとリークする。
      verifierRef.current?.clear();
      verifierRef.current = null;
    };
  }, []);

  const sendSms = async (phoneE164: string) => {
    if (!verifierRef.current) {
      throw new Error("recaptcha_not_ready");
    }
    return signInWithPhoneNumber(auth, phoneE164, verifierRef.current);
  };

  return <>{children({ recaptchaContainerRef, sendSms })}</>;
};
