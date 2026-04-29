import { PageLayout } from "@/app/_components/Layout/PageLayout";
import styles from "./styles.module.css";
import { HeroSection } from "../HeroSection";
import { FeaturesSection } from "../FeaturesSection";

export const Top = () => {
  return (
    <PageLayout>
      <div className={styles.container}>
        <HeroSection />
        <FeaturesSection />
      </div>
    </PageLayout>
  );
};
