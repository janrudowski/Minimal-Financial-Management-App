import type {
  ChangeEventHandler,
  FormEventHandler,
} from 'react';
import { useEffect, useId, useRef } from 'react';
import CustomSelect from '../../../shared/components/CustomSelect/CustomSelect';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { cn } from '../../../shared/utils/cn';
import {
  focusFirstDialogControl,
  keepFocusInDialog,
} from '../../../shared/utils/dialogFocus';
import type {
  ExpenseFormErrors,
  ExpenseFormValues,
} from './expenseFormValidation';

type ExpenseFormModalProps<T extends string> = {
  isVisible: boolean;
  onClose: () => void;
  formData: ExpenseFormValues;
  error: ExpenseFormErrors;
  expenseTypes: readonly T[];
  selected: T;
  setSelected: (item: T) => void;
  loading: boolean;
  submitDisabled: boolean;
  submitLabel: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
};

const fieldClassName =
  'my-3 rounded-[10px] border border-app-border bg-transparent px-4 py-3 text-app-text outline-none transition focus-visible:border-app-text focus-visible:ring-4 focus-visible:ring-app-accent/30 dark:border-app-dark-border dark:text-slate-50';
const invalidFieldClassName =
  'border-app-danger focus-visible:border-app-danger focus-visible:ring-app-danger/20';

function FieldError({ message }: { message: string | null }) {
  return (
    <p
      className='min-h-5 px-4 text-sm font-normal text-app-danger'
      role={message ? 'alert' : undefined}
    >
      {message ?? ''}
    </p>
  );
}

export default function ExpenseFormModal<T extends string>({
  isVisible,
  onClose,
  formData,
  error,
  expenseTypes,
  selected,
  setSelected,
  loading,
  submitDisabled,
  submitLabel,
  onChange,
  onSubmit,
}: ExpenseFormModalProps<T>) {
  const titleId = useId();
  const modalTitle = submitLabel === 'Save' ? 'Edit expense' : 'Add expense';
  const loadingSubmitLabel =
    submitLabel === 'Save' ? 'Saving expense' : 'Adding expense';
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const previouslyFocusedElement = document.activeElement;
    focusFirstDialogControl(dialogRef.current);

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      keepFocusInDialog(event, dialogRef);
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement instanceof HTMLElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className='fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm'>
      <div
        aria-labelledby={titleId}
        aria-modal='true'
        className='relative max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-[10px] bg-app-surface text-app-text shadow-2xl dark:bg-app-dark-surface dark:text-slate-50'
        ref={dialogRef}
        role='dialog'
      >
        <button
          aria-label='Close expense form'
          className='m-2 flex h-8 w-8 items-center justify-center rounded-[10px] bg-app-muted text-app-text transition hover:bg-app-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent dark:bg-app-dark-muted dark:text-slate-50 dark:hover:bg-app-dark-border'
          onClick={onClose}
          type='button'
        >
          X
        </button>
        <form
          onSubmit={onSubmit}
          className='relative z-10 mx-auto flex min-h-[520px] w-[90%] flex-col px-0 pb-16 pt-4'
        >
          <h2
            className='mb-3 text-xl font-semibold text-app-text dark:text-slate-50'
            id={titleId}
          >
            {modalTitle}
          </h2>
          <input
            className={cn(fieldClassName, error.title && invalidFieldClassName)}
            onChange={onChange}
            aria-label='Title'
            aria-invalid={Boolean(error.title)}
            type='text'
            placeholder='Title'
            name='title'
            value={formData.title}
          />
          <FieldError message={error.title} />
          <input
            className={cn(
              fieldClassName,
              error.business && invalidFieldClassName
            )}
            onChange={onChange}
            aria-label='Business'
            aria-invalid={Boolean(error.business)}
            type='text'
            placeholder='Business (optional)'
            name='business'
            value={formData.business}
          />
          <FieldError message={error.business} />
          <input
            className={cn(fieldClassName, error.amount && invalidFieldClassName)}
            onChange={onChange}
            aria-label='Amount'
            aria-invalid={Boolean(error.amount)}
            type='text'
            placeholder='Amount'
            name='amount'
            value={formData.amount}
          />
          <FieldError message={error.amount} />
          <CustomSelect
            label='Expense type'
            selected={selected}
            setSelected={setSelected}
            items={expenseTypes}
            className='mt-4'
            labelClassName='text-sm font-semibold text-app-text dark:text-slate-50'
            selectClassName='border-app-border bg-transparent text-sm dark:border-app-dark-border'
          />
          <div className='mt-3 flex flex-wrap items-center gap-3'>
            <input
              onChange={onChange}
              aria-label='Date'
              aria-invalid={Boolean(error.date)}
              className={cn(
                fieldClassName,
                'my-0 w-full [color-scheme:light] dark:[color-scheme:dark] sm:w-1/2',
                error.date && invalidFieldClassName
              )}
              type='date'
              name='date'
              value={formData.date}
            />
            <input
              onChange={onChange}
              checked={formData.recurring}
              className='h-4 w-4 accent-app-green focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent'
              type='checkbox'
              name='recurring'
              id='recurringcheckbox'
            />
            <label className='text-sm font-medium' htmlFor='recurringcheckbox'>
              Recurring
            </label>
          </div>
          <FieldError message={error.date} />
          <button
            disabled={submitDisabled}
            aria-label={loading ? loadingSubmitLabel : undefined}
            className={cn(
              'mt-auto rounded-[10px] border-0 bg-app-accent px-4 py-3 font-semibold text-app-text transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-accent',
              submitDisabled && 'cursor-not-allowed opacity-70'
            )}
            type='submit'
          >
            {loading ? <Spinner width='1rem' height='1rem' /> : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}
