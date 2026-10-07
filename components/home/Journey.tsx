import styles from "@/styles/home.module.css";

const STEPS = [
  {
    title: "Complete the Initial Assessment",
    description:
      "Answer a short set of questions about your business — it takes about ten minutes.",
  },
  {
    title: "Receive Your Preliminary Score",
    description:
      "Get an initial readiness view based on your responses, plus your top gap areas.",
  },
  {
    title: "Opt In to a Consultation",
    description:
      "Choose to book a readiness consultation to review your results with our team.",
  },
  {
    title: "Attend Your Consultation",
    description:
      "Walk through your score, your gaps, and the options that fit your business.",
  },
  {
    title: "Make Your Decision",
    description:
      "You decide whether to move forward, and which readiness package fits your needs.",
  },
  {
    title: "Receive Your Checkout Link",
    description:
      "If you choose to proceed, we send a secure checkout link for the package you selected.",
  },
  {
    title: "Confirm Your Payment",
    description: "Your service is activated once your payment is confirmed.",
  },
  {
    title: "Begin Your Purchased Service",
    description:
      "Your readiness work starts, including verification and preparation for your business.",
  },
] as const;

function HorizontalArrow() {
  return (
    <svg
      className={styles.stepArrow}
      viewBox="0 0 100 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M0 10h90M80 3l10 7-10 7" />
    </svg>
  );
}

function DownArrow() {
  return (
    <svg
      className={styles.stepDownArrow}
      viewBox="0 0 20 40"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      aria-hidden="true"
    >
      <path d="M10 0v30M3 23l7 7 7-7" />
    </svg>
  );
}

export function Journey() {
  return (
    <section className={`${styles.section} ${styles.journey}`}>
      <div className={styles.wrap}>
        <div className={styles.sectionHead}>
          <p className={styles.eyebrow}>How Your Readiness Journey Works</p>
          <h2>From your first honest look to real readiness work</h2>
        </div>
        <ol className={styles.steps}>
          {STEPS.map((step, index) => {
            const stepNumber = index + 1;
            const showHorizontalArrow = index % 4 !== 3 && index !== STEPS.length - 1;
            const showDownArrow = index === 3;

            return (
              <li className={styles.step} key={step.title}>
                <div className={styles.stepBadge}>{stepNumber}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {showHorizontalArrow ? <HorizontalArrow /> : null}
                {showDownArrow ? <DownArrow /> : null}
              </li>
            );
          })}
        </ol>
        <p className={styles.journeyFoot}>
          Initial results are based on self-reported information. A Verified Readiness Score requires
          GYBS review and supporting documentation. Purchased services begin only after payment is
          confirmed.
        </p>
      </div>
    </section>
  );
}
