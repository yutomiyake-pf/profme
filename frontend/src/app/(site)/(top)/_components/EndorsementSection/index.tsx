import styles from "./styles.module.css";

const steps = [
  {
    number: "01",
    title: "フォロー申請",
    description: "評価したい相手の名刺ページからフォローを申請します。",
  },
  {
    number: "02",
    title: "承認されたら評価を送信",
    description: "フォロワーになったら、エピソードと評価タグを添えて他己評価を送信できます。",
  },
  {
    number: "03",
    title: "名刺に公開",
    description: "オーナーが承認した評価のみが名刺カードに公開されます。",
  },
];

export const EndorsementSection = () => {
  return (
    <section className={styles.endorsement}>
      <div className={styles.endorsementInner}>
        <div className={styles.header}>
          <h2 className={styles.title}>他己評価の仕組み</h2>
          <p className={styles.subtitle}>
            信頼できる仲間からの評価で、あなたの魅力をより具体的に伝えられます。
          </p>
        </div>
        <div className={styles.steps}>
          {steps.map((step, index) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber}>{step.number}</div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
              {index < steps.length - 1 && <div className={styles.connector} aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
