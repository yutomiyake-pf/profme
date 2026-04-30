import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { ProfileEditForm } from "../ProfileEditForm";
import styles from "./styles.module.css";

export const ProfileEdit = () => {
  return (
    <PageLayout enableFooter={false}>
      <div className={styles.container}>
        <ProfileEditForm />
      </div>
    </PageLayout>
  );
};
