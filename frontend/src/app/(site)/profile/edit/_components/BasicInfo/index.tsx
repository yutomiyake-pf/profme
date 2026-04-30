"use client";

import { useFormContext } from "react-hook-form";
import { Input } from "@/app/_components/Input";
import { Textarea } from "@/app/_components/Textarea";
import { ProfileFormValues } from "../ProfileEditForm/schema";
import { StepHeader } from "../StepHeader";
import styles from "./styles.module.css";
import Image from "next/image";

const gradeOptions = ["1年", "2年", "3年", "4年", "修士1年", "修士2年", "博士"];

export const BasicInfo = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ProfileFormValues>();

  const displayName = watch("displayName");
  const avatarUrl = watch("avatarUrl");
  const bio = watch("bio");
  const gakuchika = watch("gakuchika");

  return (
    <div className={styles.stepContent}>
      <StepHeader title="基本情報" description="あなたの基本的な情報を入力してください" />

      <div className={styles.avatarSection}>
        <div className={styles.avatarPreview}>
          {avatarUrl ? (
            <Image
              width={96}
              height={96}
              src={avatarUrl}
              alt=""
              className={styles.avatarImage}
              objectFit="cover"
            />
          ) : (
            <span className={styles.avatarPlaceholder}>
              {displayName ? displayName.slice(0, 2) : "You"}
            </span>
          )}
        </div>
        <button type="button" className={styles.avatarButton}>
          画像をアップロード
        </button>
      </div>

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
        value={bio}
        {...register("bio")}
      />

      <Textarea
        label="ガクチカ（学生時代に力を入れたこと）"
        placeholder="大学2年次からプログラミングサークルに所属し、チームリーダーとして..."
        maxLength={500}
        showCount
        hint="就活やインターンでアピールしたい経験を書いてください"
        error={errors.gakuchika?.message}
        value={gakuchika}
        {...register("gakuchika")}
      />
    </div>
  );
};
