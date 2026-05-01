"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import styles from "./styles.module.css";

type Step = "phone" | "otp";

export const LoginForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const submitPhone = async () => {
    setError("");
    if (!phoneNumber.match(/^0[0-9]{9,10}$/)) {
      setError("正しい電話番号を入力してください");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep("otp");
  };

  const submitOtp = async () => {
    setError("");
    if (!otpCode.match(/^[0-9]{6}$/)) {
      setError("6桁の認証コードを入力してください");
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push("/dashboard");
  };

  const handleBack = () => {
    setStep("phone");
    setOtpCode("");
    setError("");
  };

  return (
    <Card padding="lg">
      {step === "phone" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitPhone();
          }}
          className={styles.form}
        >
          <div className={styles.formHeader}>
            <h2 className={styles.title}>ログイン / 新規登録</h2>
            <p className={styles.description}>
              電話番号を入力してSMS認証コードを受け取ってください
            </p>
          </div>
          <div className={styles.phoneInputWrapper}>
            <span className={styles.countryCode}>+81</span>
            <Input
              type="tel"
              placeholder="09012345678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              error={error}
              aria-label="電話番号"
            />
          </div>
          <Button type="submit" fullWidth isLoading={isLoading}>
            SMSを送信
          </Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submitOtp();
          }}
          className={styles.form}
        >
          <div className={styles.formHeader}>
            <h2 className={styles.title}>認証コード入力</h2>
            <p className={styles.description}>
              {phoneNumber} に送信された6桁のコードを入力してください
            </p>
          </div>
          <Input
            type="text"
            inputMode="numeric"
            placeholder="123456"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
            error={error}
            aria-label="認証コード"
          />
          <div className={styles.actions}>
            <Button type="submit" fullWidth isLoading={isLoading}>
              確認
            </Button>
            <button type="button" onClick={handleBack} className={styles.backButton}>
              電話番号を変更する
            </button>
          </div>
        </form>
      )}
    </Card>
  );
};
