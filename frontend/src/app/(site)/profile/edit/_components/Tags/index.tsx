"use client";

import { useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { IoAdd } from "react-icons/io5";
import { Input } from "@/app/_components/Input";
import { Tag } from "@/app/_components/Tag";
import { ProfileFormValues } from "../ProfileEditForm/schema";
import { StepHeader } from "../StepHeader";
import styles from "./styles.module.css";

type TagField = "skills" | "hobbies" | "qualifications";
type TagVariant = "skill" | "hobby" | "qualification";

const MAX_TAGS = 10;

interface TagInputSectionProps {
  field: TagField;
  label: string;
  placeholder: string;
  variant: TagVariant;
  hint: string;
}

const TagInputSection = ({ field, label, placeholder, variant, hint }: TagInputSectionProps) => {
  const { control, setValue } = useFormContext<ProfileFormValues>();
  const tags = useWatch({ control, name: field });
  const [input, setInput] = useState("");
  const isFull = tags.length >= MAX_TAGS;
  const trimmed = input.trim();
  const canAdd = !isFull && trimmed.length > 0 && !tags.includes(trimmed);

  const add = () => {
    if (!canAdd) return;
    setValue(field, [...tags, trimmed], { shouldValidate: true, shouldDirty: true });
    setInput("");
  };

  const remove = (value: string) => {
    setValue(
      field,
      tags.filter((t) => t !== value),
      { shouldValidate: true, shouldDirty: true },
    );
  };

  return (
    <div className={styles.tagSection}>
      <div className={styles.tagHeader}>
        <label className={styles.tagLabel}>{label}</label>
        <span className={styles.tagCount}>
          {tags.length}/{MAX_TAGS}
        </span>
      </div>
      <p className={styles.tagHint}>{hint}</p>
      <div className={styles.tagInputRow}>
        <Input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isFull}
          aria-label={label}
        />
        <button
          type="button"
          className={styles.addButton}
          onClick={add}
          disabled={!canAdd}
          aria-label={`${label}を追加`}
        >
          <IoAdd size={20} />
        </button>
      </div>
      <div className={styles.tagList}>
        {tags.map((tag) => (
          <Tag key={tag} variant={variant} removable onRemove={() => remove(tag)}>
            {tag}
          </Tag>
        ))}
      </div>
    </div>
  );
};

export const Tags = () => {
  return (
    <div className={styles.stepContent}>
      <StepHeader
        title="スキル・趣味・資格"
        description={`あなたの個性を表現するタグを追加してください（各最大${MAX_TAGS}個）`}
      />
      <TagInputSection
        field="skills"
        label="スキル"
        placeholder="スキルを入力"
        variant="skill"
        hint="React、TypeScript、英語、データ分析など"
      />
      <TagInputSection
        field="hobbies"
        label="趣味"
        placeholder="趣味を入力"
        variant="hobby"
        hint="読書、映画鑑賞、カメラ、ランニングなど"
      />
      <TagInputSection
        field="qualifications"
        label="資格"
        placeholder="資格を入力"
        variant="qualification"
        hint="TOEIC、簿記、応用情報技術者など"
      />
    </div>
  );
};
