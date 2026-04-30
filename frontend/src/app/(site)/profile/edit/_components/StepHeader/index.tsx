import styles from "./styles.module.css";

interface Props {
  title: string;
  description: string;
}

export const StepHeader = ({ title, description }: Props) => {
  return (
    <div className={styles.stepHeader}>
      <h2 className={styles.stepTitle}>{title}</h2>
      <p className={styles.stepDescription}>{description}</p>
    </div>
  );
};
