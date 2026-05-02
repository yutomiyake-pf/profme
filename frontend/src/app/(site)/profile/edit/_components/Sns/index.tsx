"use client";

import { useFieldArray, useFormContext, useFormState } from "react-hook-form";
import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import { IoAdd, IoClose } from "react-icons/io5";
import { Button } from "@/app/_components/Button";
import { Input } from "@/app/_components/Input";
import { ProfileFormValues } from "../ProfileEditForm/schema";
import { StepHeader } from "../StepHeader";
import styles from "./styles.module.css";

const MAX_CUSTOM_LINKS = 10;

type SnsField = "twitter" | "instagram" | "github" | "linkedin";

const snsInputs: ReadonlyArray<{
  name: SnsField;
  Icon: IconType;
  label: string;
  placeholder: string;
}> = [
  {
    name: "twitter",
    Icon: FaXTwitter,
    label: "X (Twitter)",
    placeholder: "https://x.com/username",
  },
  {
    name: "instagram",
    Icon: FaInstagram,
    label: "Instagram",
    placeholder: "https://instagram.com/username",
  },
  {
    name: "github",
    Icon: FaGithub,
    label: "GitHub",
    placeholder: "https://github.com/username",
  },
  {
    name: "linkedin",
    Icon: FaLinkedinIn,
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
  },
];

export const Sns = () => {
  const { register, control } = useFormContext<ProfileFormValues>();
  const { errors } = useFormState({
    control,
    name: ["twitter", "instagram", "github", "linkedin", "customLinks"],
  });

  const snsErrors: Record<SnsField, string | undefined> = {
    twitter: errors.twitter?.message,
    instagram: errors.instagram?.message,
    github: errors.github?.message,
    linkedin: errors.linkedin?.message,
  };

  const { fields, append, remove } = useFieldArray({ control, name: "customLinks" });

  return (
    <div className={styles.stepContent}>
      <StepHeader
        title="SNS・ポートフォリオ"
        description="SNSアカウントやポートフォリオのURLを登録できます（すべて任意）"
      />

      <div className={styles.snsGrid}>
        {snsInputs.map(({ name, Icon, label, placeholder }) => (
          <div key={name} className={styles.snsItem}>
            <div className={styles.snsIcon}>
              <Icon size={20} />
            </div>
            <Input
              type="url"
              inputMode="url"
              placeholder={placeholder}
              aria-label={label}
              error={snsErrors[name]}
              {...register(name)}
            />
          </div>
        ))}
      </div>

      <div className={styles.customLinksSection}>
        <div className={styles.customLinksHeader}>
          <span className={styles.customLinksLabel}>その他のURL</span>
          <span className={styles.customLinksCount}>
            {fields.length} / {MAX_CUSTOM_LINKS}
          </span>
        </div>
        <p className={styles.customLinksHint}>
          ブログ、Webサイト、ポートフォリオなど自由に追加できます
        </p>

        {fields.length > 0 && (
          <div className={styles.customLinksList}>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.customLinkItem}>
                <div className={styles.customLinkInputs}>
                  <Input
                    placeholder="表示名（例：ポートフォリオ）"
                    aria-label={`リンク${index + 1}のタイトル`}
                    error={errors.customLinks?.[index]?.title?.message}
                    {...register(`customLinks.${index}.title`)}
                  />
                  <Input
                    type="url"
                    inputMode="url"
                    placeholder="https://example.com"
                    aria-label={`リンク${index + 1}のURL`}
                    error={errors.customLinks?.[index]?.url?.message}
                    {...register(`customLinks.${index}.url`)}
                  />
                </div>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => remove(index)}
                  aria-label={`リンク${index + 1}を削除`}
                >
                  <IoClose size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        {fields.length < MAX_CUSTOM_LINKS && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => append({ title: "", url: "" })}
          >
            <IoAdd size={16} />
            URLを追加
          </Button>
        )}
      </div>
    </div>
  );
};
