"use client";

import { ReactNode, createContext, useContext, useState } from "react";
import clsx from "clsx";
import styles from "./styles.module.css";

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

interface TabsProps {
  children: ReactNode;
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export const Tabs = ({
  children,
  defaultValue,
  value,
  onValueChange,
  className,
}: TabsProps) => {
  const [internalTab, setInternalTab] = useState(defaultValue);
  const activeTab = value ?? internalTab;

  const setActiveTab = (next: string) => {
    if (value === undefined) setInternalTab(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={clsx(styles.tabs, className)}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabListProps {
  children: ReactNode;
  className?: string;
}

export const TabList = ({ children, className }: TabListProps) => {
  return (
    <div className={clsx(styles.tabList, className)} role="tablist">
      {children}
    </div>
  );
};

interface TabTriggerProps {
  children: ReactNode;
  value: string;
  badge?: number;
  className?: string;
}

export const TabTrigger = ({ children, value, badge, className }: TabTriggerProps) => {
  const { activeTab, setActiveTab } = useTabsContext();
  const isActive = activeTab === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      className={clsx(styles.tabTrigger, isActive && styles.active, className)}
      onClick={() => setActiveTab(value)}
    >
      {children}
      {badge !== undefined && badge > 0 && <span className={styles.badge}>{badge}</span>}
    </button>
  );
};

interface TabContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

export const TabContent = ({ children, value, className }: TabContentProps) => {
  const { activeTab } = useTabsContext();

  if (activeTab !== value) return null;

  return (
    <div id={`panel-${value}`} role="tabpanel" className={clsx(styles.tabContent, className)}>
      {children}
    </div>
  );
};
