import type { ChangeEventHandler, FormEventHandler } from 'react';
import Spinner from '../../../shared/components/Spinner/Spinner';
import { cn } from '../../../shared/utils/cn';
import type { SettingsFormErrors, SettingsFormValues } from './useSettingsForm';

type SettingsFormProps = {
  errors: SettingsFormErrors;
  isEditing: boolean;
  loading: boolean;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onEdit: () => void;
  onSubmit: FormEventHandler<HTMLFormElement>;
  values: SettingsFormValues;
};

export default function SettingsForm({
  errors,
  isEditing,
  loading,
  onChange,
  onEdit,
  onSubmit,
  values,
}: SettingsFormProps) {
  const isSubmitDisabled = !isEditing || loading;
  const passwordErrorId = errors.password ? 'settings-password-error' : undefined;
  const passwordHasError = Boolean(errors.password);
  const inputClassName = (hasError = false) =>
    cn(
      'h-12 rounded-[10px] border border-app-border bg-transparent px-3 py-2 text-app-text outline-none transition-colors',
      'focus-visible:border-app-green focus-visible:ring-2 focus-visible:ring-app-green/35 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg',
      'dark:border-app-dark-border dark:text-slate-50 dark:focus-visible:ring-offset-app-dark-bg',
      !isEditing &&
        'cursor-not-allowed bg-app-muted text-app-subtle opacity-100 dark:bg-app-dark-muted dark:text-slate-300',
      hasError &&
        'border-app-danger focus-visible:border-app-danger focus-visible:ring-app-danger/30'
    );
  const labelClassName =
    'mb-2 text-sm font-bold text-app-subtle dark:text-slate-300';
  const rowClassName =
    'mb-8 grid w-full max-w-[840px] grid-cols-1 gap-6 md:grid-cols-2 md:gap-10';
  const fieldClassName = 'flex w-full flex-col';

  return (
    <div className='mt-10 px-4 py-8 sm:p-10'>
      <h3 className='mb-2 text-xl font-semibold text-app-text dark:text-slate-50'>
        Account Information
      </h3>
      <p className='text-app-subtle dark:text-slate-300'>
        Update your account information
      </p>
      <div className='my-10 flex max-w-[840px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center sm:gap-6'>
        <h3 className='text-xl font-semibold text-app-text dark:text-slate-50'>
          Personal Information
        </h3>
        <button
          className='inline-flex items-center gap-1 rounded-md border-0 bg-transparent px-2 py-1 text-base font-semibold text-app-green transition-colors hover:text-app-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg dark:hover:text-slate-50 dark:focus-visible:ring-offset-app-dark-bg'
          onClick={onEdit}
          type='button'
        >
          <img
            src='/icons/edit-icon.png'
            alt=''
            aria-hidden='true'
            className='h-4 w-4'
          />
          Edit
        </button>
      </div>
      <form
        className='text-app-subtle dark:text-slate-300'
        onSubmit={onSubmit}
      >
        <div className='mb-8 grid w-full max-w-[840px] grid-cols-1'>
          <div className={fieldClassName}>
            <label
              className={labelClassName}
              htmlFor='name'
            >
              Name
            </label>
            <input
              disabled={!isEditing}
              className={inputClassName()}
              type='text'
              name='name'
              id='name'
              value={values.name}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={rowClassName}>
          <div className={fieldClassName}>
            <label
              className={labelClassName}
              htmlFor='email'
            >
              Email
            </label>
            <input
              disabled={!isEditing}
              className={inputClassName()}
              type='email'
              name='email'
              id='email'
              value={values.email}
              onChange={onChange}
            />
          </div>
          <div className={fieldClassName}>
            <label
              className={labelClassName}
              htmlFor='phone'
            >
              Mobile Number
            </label>
            <input
              disabled={!isEditing}
              className={inputClassName()}
              type='tel'
              name='phone'
              id='phone'
              value={values.phone}
              onChange={onChange}
            />
          </div>
        </div>
        <div className={rowClassName}>
          <div className={fieldClassName}>
            <label
              className={labelClassName}
              htmlFor='password'
            >
              Password
            </label>
            <input
              disabled={!isEditing}
              className={inputClassName(passwordHasError)}
              type='password'
              name='password'
              id='password'
              placeholder='********'
              value={values.password}
              onChange={onChange}
              autoComplete='new-password'
              aria-describedby={passwordErrorId}
              aria-invalid={passwordHasError || undefined}
            />
          </div>
          <div className={fieldClassName}>
            <label
              className={labelClassName}
              htmlFor='passwordConfirm'
            >
              Confirm Password
            </label>
            <input
              disabled={!isEditing}
              className={inputClassName(passwordHasError)}
              type='password'
              name='passwordConfirm'
              id='passwordConfirm'
              placeholder='********'
              value={values.passwordConfirm}
              onChange={onChange}
              autoComplete='new-password'
              aria-describedby={passwordErrorId}
              aria-invalid={passwordHasError || undefined}
            />
            {errors.password && (
              <p
                className='mt-2 text-sm font-semibold text-app-danger'
                id='settings-password-error'
                role='alert'
              >
                {errors.password}
              </p>
            )}
          </div>
        </div>
        <button
          disabled={isSubmitDisabled}
          className='inline-flex min-h-[52px] w-full items-center justify-center rounded-[10px] border-0 bg-app-green px-4 text-base font-semibold text-white transition-colors hover:bg-app-green/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-app-green/40 focus-visible:ring-offset-2 focus-visible:ring-offset-app-bg disabled:cursor-not-allowed disabled:bg-app-green/70 disabled:text-white/80 sm:w-[190px] dark:focus-visible:ring-offset-app-dark-bg'
          type='submit'
          aria-busy={loading || undefined}
          aria-label={loading ? 'Updating settings' : undefined}
        >
          {loading ? (
            <Spinner
              width='1em'
              height='1em'
            />
          ) : (
            'Update'
          )}
        </button>
      </form>
    </div>
  );
}
