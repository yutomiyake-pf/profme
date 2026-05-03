"use client";

import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { toast } from "sonner";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import { Textarea } from "@/app/_components/Textarea";
import {
  ENDORSEMENT_MAX_TAGS,
  ENDORSEMENT_RELATIONSHIPS,
  ENDORSEMENT_TAGS,
  type EndorsementTag,
} from "@/constants/endorsement";
import { CreateEndorsementContainer } from "../../_containers/CreateEndorsementContainer";
import { type EndorsementFormValues, endorsementFormSchema } from "./schema";
import styles from "./styles.module.css";

interface Props {
  recipientUserId: string;
}

export const EndorsementForm = ({ recipientUserId }: Props) => {
  const methods = useForm<EndorsementFormValues>({
    resolver: zodResolver(endorsementFormSchema),
    mode: "onBlur",
    // relationship は select だが初期値が空のため undefined ではなく `as` でキャスト。
    // submit 前は zod により invalid 判定される (= ユーザに「関係性を選択」エラーが出る)。
    defaultValues: {
      relationship: "" as EndorsementFormValues["relationship"],
      episode: "",
      tags: [],
    },
  });
  const {
    register,
    control,
    setValue,
    reset,
    formState: { errors },
  } = methods;

  const selectedTags = useWatch({ control, name: "tags" });
  const episode = useWatch({ control, name: "episode" });

  const toggleTag = (tag: EndorsementTag) => {
    if (selectedTags.includes(tag)) {
      setValue(
        "tags",
        selectedTags.filter((t) => t !== tag),
        { shouldValidate: true, shouldDirty: true },
      );
    } else if (selectedTags.length < ENDORSEMENT_MAX_TAGS) {
      setValue("tags", [...selectedTags, tag], { shouldValidate: true, shouldDirty: true });
    }
  };

  return (
    <CreateEndorsementContainer userId={recipientUserId}>
      {({ createEndorsement }) => {
        const onSubmit = methods.handleSubmit(async (values) => {
          try {
            await createEndorsement({
              relationship: values.relationship,
              episode: values.episode,
              tags: values.tags,
            });
            toast.success("評価を送信しました。承認されると公開されます");
            reset();
          } catch (err) {
            toast.error(err instanceof Error ? `送信に失敗しました (${err.message})` : "送信に失敗しました");
          }
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
                  {ENDORSEMENT_RELATIONSHIPS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {errors.relationship && (
                  <p className={styles.error}>{errors.relationship.message}</p>
                )}
              </div>

              <Textarea
                label="エピソード"
                placeholder="具体的なエピソードを入力してください（30〜300字）"
                maxLength={300}
                showCount
                required
                error={errors.episode?.message}
                value={episode}
                {...register("episode")}
              />

              <div className={styles.tagsSection}>
                <div className={styles.tagsHeader}>
                  <label className={styles.tagsLabel}>
                    評価タグ（1〜{ENDORSEMENT_MAX_TAGS}個選択）
                  </label>
                  <span className={styles.tagsCount}>
                    {selectedTags.length}/{ENDORSEMENT_MAX_TAGS}
                  </span>
                </div>
                <div className={styles.tagOptions}>
                  {ENDORSEMENT_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={clsx(
                        styles.tagButton,
                        selectedTags.includes(tag) && styles.selected,
                      )}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                {errors.tags && <p className={styles.error}>{errors.tags.message}</p>}
              </div>

              <div className={styles.actions}>
                <Button type="button" variant="outline" onClick={() => reset()}>
                  キャンセル
                </Button>
                <Button type="submit" isLoading={methods.formState.isSubmitting}>
                  送信する
                </Button>
              </div>
            </form>
          </Card>
        );
      }}
    </CreateEndorsementContainer>
  );
};
