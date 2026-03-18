import { ProgressBar } from '@/components/shared/ProgressBar';
import { Button } from '@/components/shared/Button';
import { Card } from '@/components/shared/Card';

interface AssessmentFlowProps {
  step: number;
  totalSteps: number;
  stepTitle: string;
  onPrevious?: () => void;
  onNext?: () => void;
  onSubmit?: () => void;
  submitting?: boolean;
  errors: Record<string, string>;
  children: React.ReactNode;
}

export function AssessmentFlow({
  step,
  totalSteps,
  stepTitle,
  onPrevious,
  onNext,
  onSubmit,
  submitting,
  errors,
  children,
}: AssessmentFlowProps) {
  const isLastStep = step === totalSteps;

  return (
    <div className="mx-auto max-w-xl">
      <Card className="space-y-8 bg-[color:var(--color-surface)] px-6 py-7 sm:px-8 sm:py-8">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-[13px] text-[color:var(--color-text-muted)]">
            <span>
              Question {step} of {totalSteps}
            </span>
            <span>{Math.round((step / totalSteps) * 100)}% complete</span>
          </div>
          <ProgressBar current={step} total={totalSteps} />
          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[color:var(--color-primary)]">
              Intake question
            </p>
            <h2 className="text-[1.6rem] font-semibold leading-snug text-[color:var(--color-text-primary)]">
              {stepTitle}
            </h2>
          </div>
        </div>

        <div className="min-h-[260px] pt-2">{children}</div>

        {errors._form && (
          <p className="text-sm text-[color:var(--color-danger)]" role="alert">
            {errors._form}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-[color:var(--color-border)] pt-4">
          {onPrevious ? (
            <button
              type="button"
              onClick={onPrevious}
              className="text-sm font-medium text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              disabled={submitting}
            >
              Back
            </button>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-3">
            {isLastStep && onSubmit ? (
              <Button onClick={onSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit and generate score'}
              </Button>
            ) : (
              onNext && (
                <Button onClick={onNext} disabled={submitting}>
                  Continue →
                </Button>
              )
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
