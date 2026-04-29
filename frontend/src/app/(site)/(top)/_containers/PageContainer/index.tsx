import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export const PageContainer = ({ children }: Props) => {
  return children;
};
