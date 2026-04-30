"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { BasicInfo } from "../BasicInfo";
import { Sns } from "../Sns";
import { Stepper } from "../Stepper";
import { Tags } from "../Tags";
import {
  ProfileFormValues,
  defaultProfileFormValues,
  profileFormSchema,
  stepFields,
} from "./schema";
import styles from "./styles.module.css";

type StepId = 1 | 2 | 3;

const steps: { id: StepId; label: string }[] = [
  { id: 1, label: "基本情報" },
  { id: 2, label: "SNS・ポートフォリオ" },
  { id: 3, label: "スキル・趣味・推し活" },
];

export const ProfileEditForm = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepId>(1);

  const methods = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onBlur",
    defaultValues: defaultProfileFormValues,
  });

  const handleNext = async () => {
    const valid = await methods.trigger(stepFields[currentStep]);
    if (valid && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const onSubmit = methods.handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/dashboard");
  });

  return (
    <FormProvider {...methods}>
      <form className={styles.container} onSubmit={onSubmit} noValidate>
        <div className={styles.header}>
          <h1 className={styles.title}>プロフィール編集</h1>
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        <Card className={styles.formCard} padding="lg">
          {currentStep === 1 && <BasicInfo />}
          {currentStep === 2 && <Sns />}
          {currentStep === 3 && <Tags />}
        </Card>

        <div className={styles.actions}>
          {currentStep > 1 && (
            <Button key="back" type="button" variant="outline" onClick={handleBack}>
              戻る
            </Button>
          )}
          {currentStep < 3 ? (
            <Button key="next" type="button" onClick={handleNext}>
              次へ
            </Button>
          ) : (
            <Button key="submit" type="submit" isLoading={methods.formState.isSubmitting}>
              保存する
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
};
