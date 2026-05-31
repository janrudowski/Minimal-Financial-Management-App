import { cn } from '../../utils/cn';

type DarkModeSwitchProps = {
  checked: boolean;
  onToggle: () => void;
};

export default function DarkModeSwitch({
  checked,
  onToggle,
}: DarkModeSwitchProps) {
  return (
    <button
      aria-checked={checked}
      aria-label='Dark mode'
      className='mt-4 ml-4 flex items-center gap-2 rounded-md text-app-subtle transition-colors hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:text-slate-300 dark:hover:text-white'
      onClick={onToggle}
      role='switch'
      type='button'
    >
      <span
        aria-hidden='true'
        className='flex h-6 w-10 items-center rounded-full bg-app-subtle p-1 shadow-inner transition-colors dark:bg-slate-500'
      >
        <span
          className={cn(
            'h-4 w-4 rounded-full bg-app-surface transition-transform duration-300 dark:bg-app-dark-bg',
            checked && 'translate-x-4'
          )}
        />
      </span>
      <span className='text-base font-semibold'>Dark mode</span>
    </button>
  );
}
