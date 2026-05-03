"use client";

import { type ReactNode, useState } from "react";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { auth, storage } from "@/lib/firebase/client";
import { AVATAR_ALLOWED_MIME, AVATAR_MAX_BYTES, type AvatarMimeType } from "@/constants/avatar";

export interface AvatarUploadRenderProps {
  uploadAvatar: (file: File) => Promise<string>;
  isUploading: boolean;
}

interface Props {
  children: (props: AvatarUploadRenderProps) => ReactNode;
}

export const AvatarUploadContainer = ({ children }: Props) => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadAvatar = async (file: File): Promise<string> => {
    if (!AVATAR_ALLOWED_MIME.includes(file.type as AvatarMimeType)) {
      throw new Error("画像は JPG / PNG / WebP のみ対応しています");
    }
    if (file.size > AVATAR_MAX_BYTES) {
      throw new Error("画像サイズは 2MB 以下にしてください");
    }
    const uid = auth.currentUser?.uid;
    if (!uid) {
      throw new Error("ログインが必要です");
    }

    setIsUploading(true);
    try {
      const ext = file.type.split("/")[1] ?? "jpg";
      const path = `users/${uid}/avatar/${Date.now()}.${ext}`;
      const fileRef = storageRef(storage, path);
      await uploadBytes(fileRef, file, { contentType: file.type });
      return await getDownloadURL(fileRef);
    } finally {
      setIsUploading(false);
    }
  };

  return <>{children({ uploadAvatar, isUploading })}</>;
};
