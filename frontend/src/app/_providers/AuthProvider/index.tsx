"use client";

import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { type User, onIdTokenChanged } from "firebase/auth";
import { sessionResponseSchema } from "@/app/api/auth/session/type";
import { auth } from "@/lib/firebase/client";
import { clientFetcher } from "@/lib/fetcher/client";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onIdTokenChanged は onAuthStateChanged よりも頻繁に発火する:
    //   - サインイン / サインアウト時
    //   - SDK が ID Token を自動更新したとき (約 55 分ごと)
    // ここで毎回サーバ側の session cookie も同期 → 短命 cookie + auto-refresh で
    // 「14 日固定発行のまま放置されない」運用にできる。
    return onIdTokenChanged(auth, async (next) => {
      setUser(next);
      setLoading(false);

      if (next) {
        // ID Token を取得してサーバに送り、cookie を発行し直す。
        // 失敗しても UI は壊さないので throwErr: false。
        const idToken = await next.getIdToken();
        await clientFetcher("/api/auth/session", {
          schema: sessionResponseSchema,
          method: "POST",
          body: { idToken },
          throwErr: false,
        });
      } else {
        // クライアント側がサインアウト → サーバ側の cookie も破棄して同期を保つ。
        await clientFetcher("/api/auth/session", {
          schema: sessionResponseSchema,
          method: "DELETE",
          throwErr: false,
        });
      }
    });
  }, []);

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
