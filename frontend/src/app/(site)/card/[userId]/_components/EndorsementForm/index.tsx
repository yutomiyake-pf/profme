"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Textarea } from "@/app/_components/Textarea";
import {
  EndorsementFormValues,
  defaultEndorsementFormValues,
  endorsementFormSchema,
} from "./schema";
import styles from "./styles.module.css";

const relationshipOptions = ["同期", "先輩", "後輩", "インターン仲間", "サークル仲間", "その他"];

const tagOptions = [
  "リーダーシップ",
  "コミュニケーション力",
  "行動力",
  "粘り強さ",
  "創造性",
  "技術力",
  "誠実さ",
  "ユーモア",
  "頼れる存在",
  "学習意欲",
  "チームワーク",
  "発想力",
];

const MAX_TAGS = 3;

export const EndorsementForm = () => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EndorsementFormValues>({
    resolver: zodResolver(endorsementFormSchema),
    mode: "onBlur",
    defaultValues: defaultEndorsementFormValues,
  });

  const selectedTags = useWatch({ control, name: "tags" });
  const episode = useWatch({ control, name: "episode" });

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setValue(
        "tags",
        selectedTags.filter((t) => t !== tag),
        { shouldValidate: true, shouldDirty: true },
      );
    } else if (selectedTags.length < MAX_TAGS) {
      setValue("tags", [...selectedTags, tag], { shouldValidate: true, shouldDirty: true });
    }
  };

  const handleCancel = () => {
    reset(defaultEndorsementFormValues);
  };

  const onSubmit = handleSubmit(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    reset(defaultEndorsementFormValues);
  });

  return (
    <Card padding="lg">
      <div className={styles.header}>
        <h3 className={styles.title}>評価を送る</h3>
      </div>

      <form onSubmit={onSubmit} className={styles.formContent} noValidate>
        <div className={styles.selectWrapper}>
          <label className={styles.selectLabel}>関係性</label>
          <select className={styles.select} {...register("relationship")}>
            <option value="">選択してください</option>
            {relationshipOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <Textarea
          label="エピソード"
          placeholder="具体的なエピソードを入力してください（30〜300字）"
          minLength={30}
          maxLength={300}
          showCount
          required
          error={errors.episode?.message}
          value={episode}
          {...register("episode")}
        />

        <div className={styles.tagsSection}>
          <div className={styles.tagsHeader}>
            <label className={styles.tagsLabel}>評価タグ（1〜{MAX_TAGS}個選択）</label>
            <span className={styles.tagsCount}>
              {selectedTags.length}/{MAX_TAGS}
            </span>
          </div>
          <div className={styles.tagOptions}>
            {tagOptions.map((tag) => (
              <button
                key={tag}
                type="button"
                className={clsx(styles.tagButton, selectedTags.includes(tag) && styles.selected)}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
          {errors.tags && <p className={styles.error}>{errors.tags.message}</p>}
        </div>

        <div className={styles.actions}>
          <Button type="button" variant="outline" onClick={handleCancel}>
            キャンセル
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            送信する
          </Button>
        </div>
      </form>
    </Card>
  );
};
