"use client";

import { type ChangeEvent, useRef } from "react";
import Image from "next/image";
import { useFormContext, useFormState, useWatch } from "react-hook-form";
import { toast } from "sonner";
import { Input } from "@/app/_components/Input";
import { Textarea } from "@/app/_components/Textarea";
import { AVATAR_ALLOWED_MIME } from "@/constants/avatar";
import { AvatarUploadContainer } from "../../_containers/AvatarUploadContainer";
import { ProfileFormValues } from "../ProfileEditForm/schema";
import { StepHeader } from "../StepHeader";
import styles from "./styles.module.css";

const gradeOptions = ["1年", "2年", "3年", "4年", "修士1年", "修士2年", "博士"];

export const BasicInfo = () => {
  const { register, control, setValue } = useFormContext<ProfileFormValues>();
  // useFormContext からの formState destructure / watch は subscription が効かないので明示的な hook を使う
  const { errors } = useFormState({ control });
  const displayName = useWatch({ control, name: "displayName" });
  const avatarUrl = useWatch({ control, name: "avatarUrl" });

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={styles.stepContent}>
      <StepHeader title="基本情報" description="あなたの基本的な情報を入力してください" />

      <AvatarUploadContainer>
        {({ uploadAvatar, isUploading }) => {
          const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              const url = await uploadAvatar(file);
              setValue("avatarUrl", url, { shouldDirty: true, shouldValidate: true });
              toast.success("アップロードしました");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "アップロードに失敗しました");
            }
          };

          return (
            <div className={styles.avatarSection}>
              <div className={styles.avatarPreview}>
                {avatarUrl ? (
                  <Image
                    width={96}
                    height={96}
                    src={avatarUrl}
                    alt=""
                    className={styles.avatarImage}
                    unoptimized
                  />
                ) : (
                  <span className={styles.avatarPlaceholder}>
                    {displayName ? displayName.slice(0, 2) : "You"}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept={AVATAR_ALLOWED_MIME.join(",")}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <button
                type="button"
                className={styles.avatarButton}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? "アップロード中..." : "画像をアップロード"}
              </button>
            </div>
          );
        }}
      </AvatarUploadContainer>

      <div className={styles.formGrid}>
        <Input
          label="表示名"
          placeholder="山田 太郎"
          required
          error={errors.displayName?.message}
          {...register("displayName")}
        />
        <Input
          label="大学名"
          placeholder="東京大学"
          error={errors.university?.message}
          {...register("university")}
        />
        <Input
          label="学部"
          placeholder="工学部"
          error={errors.faculty?.message}
          {...register("faculty")}
        />
        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>学年</label>
          <select className={styles.select} {...register("grade")}>
            <option value="">選択してください</option>
            {gradeOptions.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Textarea
        label="自己紹介"
        placeholder="フロントエンドエンジニアを目指して日々学習中です..."
        maxLength={200}
        showCount
        hint="あなたのことを簡潔に紹介してください"
        error={errors.bio?.message}
        {...register("bio")}
      />

      <Textarea
        label="ガクチカ（学生時代に力を入れたこと）"
        placeholder="大学2年次からプログラミングサークルに所属し、チームリーダーとして..."
        maxLength={500}
        showCount
        hint="就活やインターンでアピールしたい経験を書いてください"
        error={errors.gakuchika?.message}
        {...register("gakuchika")}
      />
    </div>
  );
};
