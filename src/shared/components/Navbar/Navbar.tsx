import { useEffect, useId, useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center rounded-lg px-4 py-3 text-base font-semibold text-app-subtle transition-colors hover:bg-app-muted hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:text-slate-300 dark:hover:bg-app-dark-muted dark:hover:text-white',
    isActive &&
      'bg-app-accent text-slate-950 hover:bg-app-accent hover:text-slate-950 dark:bg-app-accent dark:text-slate-950 dark:hover:bg-app-accent dark:hover:text-slate-950'
  );

const navIconClassName = 'mr-2 h-4 w-4 fill-current';

const navItems = [
  {
    href: '/',
    iconHref: '/icons/home-icon.svg#Capa_1',
    label: 'Dashboard',
  },
  {
    href: '/transactions',
    iconHref: '/icons/chart-icon.svg#Capa_1',
    label: 'Expenses',
  },
  {
    href: '/settings',
    iconHref: '/icons/settings-icon.svg#Capa_1',
    label: 'Settings',
  },
];

type NavbarProps = {
  darkModeSwitch: ReactNode;
  onLogout: () => void | Promise<void>;
};

type NavigationLinksProps = {
  label: string;
  onNavigate?: () => void;
};

function AppLogo({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden='true'
      className={cn('h-10 w-auto text-app-text dark:text-white', className)}
      focusable='false'
    >
      <use href='/images/Logo.svg#Layer_1'></use>
    </svg>
  );
}

function NavigationLinks({ label, onNavigate }: NavigationLinksProps) {
  return (
    <nav aria-label={label} className='flex flex-1 flex-col gap-2'>
      {navItems.map((item) => (
        <NavLink
          className={navLinkClassName}
          key={item.href}
          onClick={onNavigate}
          to={item.href}
        >
          <svg
            aria-hidden='true'
            className={navIconClassName}
            focusable='false'
          >
            <use href={item.iconHref}></use>
          </svg>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function Navbar({ darkModeSwitch, onLogout }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuId = useId();

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  async function handleLogout() {
    closeMobileMenu();
    await onLogout();
  }

  useEffect(() => {
    if (!isMobileMenuOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeMobileMenu();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className='sticky top-0 z-40 flex h-16 items-center justify-between border-b border-app-border bg-app-surface px-4 shadow-sm transition-colors dark:border-app-dark-border dark:bg-app-dark-surface lg:hidden'>
        <AppLogo className='h-8' />
        <button
          aria-controls={mobileMenuId}
          aria-expanded={isMobileMenuOpen}
          aria-label='Open menu'
          className='inline-flex size-11 items-center justify-center rounded-lg border border-app-border bg-app-bg text-app-text transition hover:bg-app-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:border-app-dark-border dark:bg-app-dark-bg dark:text-slate-50 dark:hover:bg-app-dark-muted'
          onClick={() => setIsMobileMenuOpen(true)}
          type='button'
        >
          <span aria-hidden='true' className='flex w-5 flex-col gap-1'>
            <span className='h-0.5 rounded-full bg-current' />
            <span className='h-0.5 rounded-full bg-current' />
            <span className='h-0.5 rounded-full bg-current' />
          </span>
        </button>
      </header>

      <aside className='hidden min-h-screen w-64 shrink-0 border-r border-app-border bg-app-surface transition-colors dark:border-app-dark-border dark:bg-app-dark-surface lg:flex'>
        <div className='mx-auto flex h-full w-5/6 flex-col py-4'>
          <div className='my-8'>
            <AppLogo />
          </div>
          <NavigationLinks label='Main navigation' />
          <div className='mt-4'>{darkModeSwitch}</div>
          <div className='mx-8 mt-auto'>
            <button
              className='flex items-center rounded-md text-base font-semibold text-app-subtle transition-colors hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:text-slate-300 dark:hover:text-white'
              onClick={handleLogout}
              type='button'
            >
              <img
                alt=''
                className='mr-2 mb-0.5 h-4 w-auto'
                src='/icons/logout-icon.svg'
              />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {isMobileMenuOpen && (
        <div
          aria-label='Mobile menu'
          aria-modal='true'
          className='fixed inset-0 z-50 lg:hidden'
          id={mobileMenuId}
          role='dialog'
        >
          <div
            aria-hidden='true'
            className='absolute inset-0 bg-app-text/50'
            onClick={closeMobileMenu}
          />
          <aside className='relative flex h-full w-[min(20rem,86vw)] flex-col border-r border-app-border bg-app-surface px-6 py-5 shadow-2xl transition-colors dark:border-app-dark-border dark:bg-app-dark-surface'>
            <div className='mb-8 flex items-center justify-between gap-4'>
              <AppLogo className='h-8' />
              <button
                aria-label='Close menu'
                className='inline-flex size-10 items-center justify-center rounded-lg border border-app-border text-app-text transition hover:bg-app-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:border-app-dark-border dark:text-slate-50 dark:hover:bg-app-dark-muted'
                onClick={closeMobileMenu}
                type='button'
              >
                <svg
                  aria-hidden='true'
                  className='size-4 stroke-current'
                  focusable='false'
                  viewBox='0 0 16 16'
                >
                  <path
                    d='M3 3l10 10M13 3L3 13'
                    strokeLinecap='round'
                    strokeWidth='2'
                  />
                </svg>
              </button>
            </div>

            <NavigationLinks
              label='Mobile navigation'
              onNavigate={closeMobileMenu}
            />

            <div className='mt-6 border-t border-app-border pt-5 dark:border-app-dark-border'>
              {darkModeSwitch}
            </div>
            <button
              className='mt-6 flex min-h-11 items-center rounded-md text-base font-semibold text-app-subtle transition-colors hover:text-app-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-app-green dark:text-slate-300 dark:hover:text-white'
              onClick={handleLogout}
              type='button'
            >
              <img
                alt=''
                className='mr-2 mb-0.5 h-4 w-auto'
                src='/icons/logout-icon.svg'
              />
              Logout
            </button>
          </aside>
        </div>
      )}
    </>
  );
}
