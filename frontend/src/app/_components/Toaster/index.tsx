"use client";

import { Toaster as SonnerToaster } from "sonner";
import styles from "./styles.module.css";

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

interface Props {
  position?: ToastPosition;
}

/**
 * 共通トースター。アプリのルートに 1 つだけ配置する。
 * 使用側は `import { toast } from "sonner"` でメッセージを発火する。
 *
 * - position プロップでデフォルト位置を制御
 * - toast(msg, { position }) で個別に上書きも可能
 * - スタイルは globals.css の --color-{success|error|warning|info}{,-bg} を利用
 */
export const Toaster = ({ position = "top-center" }: Props) => {
  return (
    <SonnerToaster
      position={position}
      toastOptions={{
        // sonner デフォルトの appearance スタイル ([data-sonner-toast] 系) を無効化し
        // classNames で渡したクラスのみを当てる。これがないと特異性で負けて
        // 背景色などが黒のままになる。
        unstyled: true,
        classNames: {
          toast: styles.toast,
          success: styles.success,
          error: styles.error,
          warning: styles.warning,
          info: styles.info,
          title: styles.title,
          description: styles.description,
          closeButton: styles.closeButton,
        },
      }}
    />
  );
};
