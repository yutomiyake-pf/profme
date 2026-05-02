import { PageLayout } from "@/app/_components/Layout/PageLayout";
import { ProfileEditForm } from "../ProfileEditForm";
import { type ProfileFormValues } from "../ProfileEditForm/schema";
import styles from "./styles.module.css";

interface Props {
  initialValues: ProfileFormValues;
}

export const ProfileEdit = ({ initialValues }: Props) => {
  return (
    <PageLayout enableFooter={false} isLoggedIn>
      <div className={styles.container}>
        <ProfileEditForm initialValues={initialValues} />
      </div>
    </PageLayout>
  );
};
