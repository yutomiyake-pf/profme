"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { IoClose, IoMenu } from "react-icons/io5";
import { useAuth } from "@/app/_providers/AuthProvider";
import styles from "./styles.module.css";

type Props = {
  isLoggedIn?: boolean;
};

export const Header = ({ isLoggedIn = false }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const close = () => setIsOpen(false);

  const { user } = useAuth();
  const menuItems: { href: string; label: string }[] = [
    { href: "/dashboard", label: "ダッシュボード" },
    ...(user ? [{ href: `/card/${user.uid}`, label: "名刺ページ" }] : []),
    { href: "/profile/edit", label: "名刺情報編集" },
    { href: "/settings", label: "設定" },
  ];

  // メニュー外クリック / Esc で閉じる
  useEffect(() => {
    if (!isOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [isOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoText}>Profme</span>
        </Link>
        <nav className={styles.nav}>
          {isLoggedIn ? (
            <div className={styles.menuWrap} ref={wrapRef}>
              <button
                type="button"
                className={styles.hamburger}
                aria-label={isOpen ? "メニューを閉じる" : "メニューを開く"}
                aria-expanded={isOpen}
                aria-controls="header-menu"
                onClick={() => setIsOpen((v) => !v)}
              >
                {isOpen ? <IoClose size={24} /> : <IoMenu size={24} />}
              </button>
              {isOpen && (
                <div id="header-menu" className={styles.menuDropdown} role="menu">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.menuItem}
                      role="menuitem"
                      onClick={close}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className={styles.loginButton}>
              ログイン
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
