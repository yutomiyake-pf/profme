"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { type ConfirmationResult } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Input } from "@/app/_components/Input";
import { PhoneAuthContainer } from "../../_containers/PhoneAuthContainer";
import { PhoneCheckContainer } from "../../_containers/PhoneCheckContainer";
import { SessionContainer } from "../../_containers/SessionContainer";
import styles from "./styles.module.css";

type Step = "phone" | "name" | "otp";

const PHONE_DOMESTIC_PATTERN = /^0\d{9,10}$/;
const OTP_PATTERN = /^\d{6}$/;
const toE164 = (japaneseDomestic: string) => `+81${japaneseDomestic.replace(/^0/, "")}`;

export const LoginForm = () => {
  const router = useRouter();
  const [step, setStep] = useState<Step>("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePhoneInput = (raw: string) => setPhoneNumber(raw.replace(/[^0-9]/g, "").slice(0, 11));
  const handleOtpInput = (raw: string) => setOtpCode(raw.replace(/[^0-9]/g, "").slice(0, 6));

  const goBackToPhone = () => {
    setStep("phone");
    setOtpCode("");
    setDisplayName("");
    setConfirmation(null);
  };

  return (
    <PhoneCheckContainer>
      {({ checkPhone }) => (
        <PhoneAuthContainer>
          {({ recaptchaContainerRef, sendSms }) => (
            <SessionContainer>
              {({ createSession }) => {
                // 電話番号入力後の分岐:
                //   既存ユーザ → 名前入力をスキップしてそのまま SMS 送信 (otp ステップへ)
                //   未登録 → name ステップに遷移し displayName を入力させる
                // (SMS 送信は API 呼び出し回数を抑えるため "次へ" 1 回で 2 段階完結させる)
                const submitPhone = async () => {
                  if (!PHONE_DOMESTIC_PATTERN.test(phoneNumber)) {
                    toast.error("正しい電話番号を入力してください");
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const exists = await checkPhone(toE164(phoneNumber));
                    if (exists) {
                      const result = await sendSms(toE164(phoneNumber));
                      setConfirmation(result);
                      setStep("otp");
                    } else {
                      setStep("name");
                    }
                  } catch {
                    toast.error("通信に失敗しました");
                  } finally {
                    setIsLoading(false);
                  }
                };

                const submitName = async () => {
                  if (!displayName.trim()) {
                    toast.error("お名前を入力してください");
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const result = await sendSms(toE164(phoneNumber));
                    setConfirmation(result);
                    setStep("otp");
                  } catch {
                    toast.error("SMS の送信に失敗しました。時間をおいて再度お試しください");
                  } finally {
                    setIsLoading(false);
                  }
                };

                // OTP 検証〜セッション確立までの 3 段階を 1 つのトランザクションとして扱う:
                //   1. confirmation.confirm(code)  → Firebase Auth 側でユーザがサインインされる
                //   2. getIdToken()                → サーバ検証用の短命トークン取得
                //   3. createSession()             → サーバで session cookie に焼き直し+
                //                                    新規ユーザなら DB に行を作成
                // displayName は新規登録時のみ入力済み。既存ユーザは undefined のまま送る
                // (送ると無駄に上書きされる可能性があるため)
                const submitOtp = async () => {
                  if (!confirmation) {
                    toast.error("認証情報が見つかりません。電話番号入力からやり直してください");
                    return;
                  }
                  if (!OTP_PATTERN.test(otpCode)) {
                    toast.error("6 桁の認証コードを入力してください");
                    return;
                  }
                  setIsLoading(true);
                  try {
                    const credential = await confirmation.confirm(otpCode);
                    const idToken = await credential.user.getIdToken();
                    await createSession({
                      idToken,
                      ...(displayName ? { displayName } : {}),
                    });
                    toast.success("ログインしました");
                    // RSC 側のキャッシュ (= getCurrentUser のメモ化結果) を破棄して
                    // dashboard 表示時に新しいセッションで再フェッチさせる。
                    router.push("/dashboard");
                    router.refresh();
                  } catch (err) {
                    toast.error(
                      err instanceof Error
                        ? `認証に失敗しました (${err.message})`
                        : "認証に失敗しました",
                    );
                    setIsLoading(false);
                  }
                };

                return (
                  <Card padding="lg">
                    {step === "phone" && (
                      <form
                        className={styles.form}
                        onSubmit={(e) => {
                          e.preventDefault();
                          void submitPhone();
                        }}
                      >
                        <div className={styles.formHeader}>
                          <h2 className={styles.title}>ログイン / 新規登録</h2>
                          <p className={styles.description}>電話番号を入力してください</p>
                        </div>
                        <div className={styles.phoneInputWrapper}>
                          <span className={styles.countryCode}>+81</span>
                          <Input
                            type="tel"
                            inputMode="tel"
                            placeholder="09012345678"
                            value={phoneNumber}
                            onChange={(e) => handlePhoneInput(e.target.value)}
                            aria-label="電話番号"
                          />
                        </div>
                        <Button type="submit" fullWidth isLoading={isLoading}>
                          次へ
                        </Button>
                      </form>
                    )}

                    {step === "name" && (
                      <form
                        className={styles.form}
                        onSubmit={(e) => {
                          e.preventDefault();
                          void submitName();
                        }}
                      >
                        <div className={styles.formHeader}>
                          <h2 className={styles.title}>新規登録</h2>
                          <p className={styles.description}>
                            この電話番号は未登録です。お名前を入力してください
                          </p>
                        </div>
                        <Input
                          type="text"
                          label="お名前"
                          placeholder="山田 太郎"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          required
                        />
                        <div className={styles.actions}>
                          <Button type="submit" fullWidth isLoading={isLoading}>
                            SMS を送信
                          </Button>
                          <button
                            type="button"
                            onClick={goBackToPhone}
                            className={styles.backButton}
                          >
                            電話番号を変更する
                          </button>
                        </div>
                      </form>
                    )}

                    {step === "otp" && (
                      <form
                        className={styles.form}
                        onSubmit={(e) => {
                          e.preventDefault();
                          void submitOtp();
                        }}
                      >
                        <div className={styles.formHeader}>
                          <h2 className={styles.title}>認証コード入力</h2>
                          <p className={styles.description}>
                            {toE164(phoneNumber)} に送信された 6 桁のコードを入力してください
                          </p>
                        </div>
                        <Input
                          type="text"
                          inputMode="numeric"
                          placeholder="123456"
                          value={otpCode}
                          onChange={(e) => handleOtpInput(e.target.value)}
                          aria-label="認証コード"
                        />
                        <div className={styles.actions}>
                          <Button type="submit" fullWidth isLoading={isLoading}>
                            確認
                          </Button>
                          <button
                            type="button"
                            onClick={goBackToPhone}
                            className={styles.backButton}
                          >
                            電話番号を変更する
                          </button>
                        </div>
                      </form>
                    )}

                    <div ref={recaptchaContainerRef} />
                  </Card>
                );
              }}
            </SessionContainer>
          )}
        </PhoneAuthContainer>
      )}
    </PhoneCheckContainer>
  );
};
