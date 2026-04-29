import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";
import { HeroSection } from "../HeroSection";
import { FeaturesSection } from "../FeaturesSection";
import { CardPreviewSection } from "../CardPreviewSection";

export const Top = () => {
  return (
    <PageLayout>
      <div className={styles.container}>
        <HeroSection />
        <FeaturesSection />
        <CardPreviewSection />
      </div>
    </PageLayout>
  );
};
