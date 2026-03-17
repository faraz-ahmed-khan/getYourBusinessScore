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
    <Card className="space-y-6">
      <div>
        <p className="text-sm font-medium text-neutral-500">
          Step {step} of {totalSteps}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-neutral-900">{stepTitle}</h2>
        <div className="mt-3">
          <ProgressBar current={step} total={totalSteps} />
        </div>
      </div>

      <div className="min-h-[200px]">{children}</div>

      {errors._form && (
        <p className="text-sm text-red-600" role="alert">
          {errors._form}
        </p>
      )}

      <div className="flex flex-wrap gap-3 border-t border-neutral-200 pt-4">
        {onPrevious && (
          <Button variant="outline" onClick={onPrevious} disabled={submitting}>
            Previous
          </Button>
        )}
        <div className="flex-1" />
        {isLastStep && onSubmit ? (
          <Button onClick={onSubmit} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit and generate score'}
          </Button>
        ) : (
          onNext && (
            <Button onClick={onNext} disabled={submitting}>
              Next
            </Button>
          )
        )}
      </div>
    </Card>
  );
}
