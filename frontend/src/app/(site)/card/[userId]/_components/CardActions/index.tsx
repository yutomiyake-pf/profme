"use client";

import { useState } from "react";
import Link from "next/link";
import { IoCopyOutline, IoQrCodeOutline } from "react-icons/io5";
import { Button } from "@/app/_components/Button";
import { Card } from "@/app/_components/Card";
import styles from "./styles.module.css";

interface Props {
  cardUrl: string;
  isOwner: boolean;
}

export const CardActions = ({ cardUrl, isOwner }: Props) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card padding="md">
      <div className={styles.buttons}>
        <Button variant="outline" size="sm" onClick={handleCopy}>
          <IoCopyOutline size={13} />
          {copied ? "コピーしました！" : "URLをコピー"}
        </Button>

        <Button variant="outline" size="sm">
          <IoQrCodeOutline size={13} />
          QRコード
        </Button>

        {isOwner && (
          <Link href="/profile/edit">
            <Button variant="primary" size="sm">
              編集する
            </Button>
          </Link>
        )}
      </div>
    </Card>
  );
};
