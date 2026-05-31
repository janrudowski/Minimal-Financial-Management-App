import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

type TopBarProps = {
  title: string;
  profile: {
    displayName: string | null;
    email?: string | null;
    photoURL: string | null;
  } | null;
  profileLoading?: boolean;
};

export default function TopBar({
  title,
  profile,
  profileLoading = false,
}: TopBarProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const menuId = useId();
  const profileRef = useRef<HTMLElement>(null);
  const displayName = profile?.displayName ?? 'User';
  const email = profile?.email ?? 'No email available';
  const avatarSrc = profile?.photoURL ?? '/images/profile-picture.png';

  useEffect(() => {
    if (!isUserMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        event.target instanceof Node &&
        !profileRef.current?.contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [isUserMenuOpen]);

  return (
    <div className='flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
      <h2 className='min-w-0 text-2xl font-semibold text-app-text dark:text-slate-50'>
        {title}
      </h2>
      <section
        aria-label='User profile'
        className='relative w-full text-app-text sm:w-auto dark:text-slate-50'
        ref={profileRef}
      >
        <button
          aria-controls={menuId}
          aria-expanded={isUserMenuOpen}
          aria-haspopup='menu'
          aria-label={`${displayName} account menu`}
          className='flex min-h-12 w-full max-w-full items-center gap-2 rounded-full bg-app-surface p-1 pr-3 text-left shadow-sm transition-colors hover:bg-app-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green sm:w-auto sm:max-w-[300px] dark:bg-app-dark-surface dark:hover:bg-app-dark-muted'
          onClick={() => setIsUserMenuOpen((isOpen) => !isOpen)}
          type='button'
        >
          <img
            alt={`${displayName} profile picture`}
            className='h-9 w-9 shrink-0 rounded-full object-cover'
            src={avatarSrc}
          />
          {!profileLoading ? (
            <span className='min-w-0 flex-1 truncate text-sm font-semibold'>
              {displayName}
            </span>
          ) : (
            <div className='min-w-0 flex-1'>
              <Spinner width='1em' height='1em' />
            </div>
          )}
          <svg
            aria-hidden='true'
            className={`h-3.5 w-3.5 shrink-0 fill-current transition-transform ${
              isUserMenuOpen ? '-rotate-90' : 'rotate-90'
            }`}
            focusable='false'
          >
            <use href='/icons/chevron-icon.svg#Layer_1'></use>
          </svg>
        </button>

        {isUserMenuOpen && (
          <div
            aria-label='User menu'
            className='absolute right-0 z-30 mt-2 w-full min-w-[16rem] overflow-hidden rounded-lg border border-app-border bg-app-surface shadow-lg dark:border-app-dark-border dark:bg-app-dark-surface sm:w-72'
            id={menuId}
            role='menu'
          >
            <div className='border-b border-app-border px-4 py-3 dark:border-app-dark-border'>
              <p className='text-xs font-semibold uppercase text-app-subtle dark:text-slate-300'>
                Signed in as
              </p>
              <p className='mt-1 truncate text-sm font-semibold'>{displayName}</p>
              <p className='truncate text-sm text-app-subtle dark:text-slate-300'>
                {email}
              </p>
            </div>
            <Link
              className='block px-4 py-3 text-sm font-semibold text-app-text transition hover:bg-app-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:text-slate-50 dark:hover:bg-app-dark-muted'
              onClick={() => setIsUserMenuOpen(false)}
              role='menuitem'
              to='/settings'
            >
              Account settings
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
