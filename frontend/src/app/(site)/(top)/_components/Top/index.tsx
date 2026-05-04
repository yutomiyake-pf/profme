import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";
import { HeroSection } from "../HeroSection";
import { FeaturesSection } from "../FeaturesSection";
import { CardPreviewSection } from "../CardPreviewSection";
import { EndorsementSection } from "../EndorsementSection";

interface Props {
  isLoggedIn: boolean;
}

export const Top = ({ isLoggedIn }: Props) => {
  return (
    <PageLayout isLoggedIn={isLoggedIn}>
      <div className={styles.container}>
        <HeroSection />
        <FeaturesSection />
        <CardPreviewSection />
        <EndorsementSection />
      </div>
    </PageLayout>
  );
};
