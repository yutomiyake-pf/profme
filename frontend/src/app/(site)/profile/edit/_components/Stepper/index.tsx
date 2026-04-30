import { Fragment } from "react";
import clsx from "clsx";
import { IoCheckmark } from "react-icons/io5";
import styles from "./styles.module.css";

interface Step {
  id: number;
  label: string;
}

interface Props {
  steps: ReadonlyArray<Step>;
  currentStep: number;
}

export const Stepper = ({ steps, currentStep }: Props) => {
  return (
    <div className={styles.stepper}>
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <div className={styles.stepItem}>
            <div
              className={clsx(
                styles.stepCircle,
                currentStep >= step.id && styles.active,
                currentStep > step.id && styles.completed,
              )}
            >
              {currentStep > step.id ? <IoCheckmark size={14} /> : step.id}
            </div>
            <span className={clsx(styles.stepLabel, currentStep >= step.id && styles.active)}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && <div className={styles.stepLine} />}
        </Fragment>
      ))}
    </div>
  );
};
