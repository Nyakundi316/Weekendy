'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import { Home, Heart, Scan, Ticket, User } from 'lucide-react';

/**
 * AppTabs
 * - Mobile: fixed bottom tab bar (safe-area aware)
 * - Desktop: sticky top tabs bar
 * - Active state from pathname
 * - Uses --color-primary (orange) for accents
 */
export default function AppTabs() {
  const pathname = usePathname();

  const items = useMemo(
    () => [
      { href: '/',         label: 'For you',  icon: Home },
      { href: '/wishlist', label: 'Wishlist', icon: Heart },
      { href: '/scan',     label: 'Scan',     icon: Scan, primary: true },
      { href: '/tickets',  label: 'Tickets',  icon: Ticket },
      { href: '/profile',  label: 'Profile',  icon: User },
    ],
    []
  );

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  /* --- Top tabs (tablet/desktop) --- */
  const TopTabs = (
    <nav
      aria-label="Primary"
      className="hidden md:block sticky top-0 z-40 bg-white/95 dark:bg-zinc-950/90 backdrop-blur border-b border-black/5 dark:border-white/10"
    >
      <div className="container">
        <ul className="flex items-center gap-2 py-2">
          {items.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            return (
              <li key={it.href}>
                <Link
                  href={it.href}
                  className={[
                    'inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition',
                    active
                      ? 'bg-black text-white dark:bg-white dark:text-black'
                      : 'text-zinc-700 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5',
                  ].join(' ')}
                >
                  <Icon className="h-4 w-4" />
                  <span>{it.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );

  /* --- Bottom tabs (mobile) --- */
  const BottomTabs = (
    <nav
      aria-label="Primary"
      className="md:hidden fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-zinc-950/90 backdrop-blur border-t border-black/5 dark:border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5">
        {items.map((it) => {
          const Icon = it.icon;
          const active = isActive(it.href);

          if (it.primary) {
            // Center “Scan” — elevated action button
            return (
              <li key={it.href} className="flex items-center justify-center">
                <Link
                  href={it.href}
                  className="relative -mt-5 inline-flex flex-col items-center justify-center"
                >
                  <span className="sr-only">{it.label}</span>
                  <div className="grid place-items-center h-14 w-14 rounded-2xl bg-[var(--color-primary)] hover:bg-[var(--color-primary-600)] text-white shadow-lg ring-1 ring-black/10 transition">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="mt-1 text-[11px] text-zinc-700 dark:text-zinc-300">
                    {it.label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className="group relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
              >
                <Icon
                  className={
                    'h-5 w-5 transition ' +
                    (active
                      ? 'text-[var(--color-primary)]'
                      : 'text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200')
                  }
                />
                <span
                  className={
                    active
                      ? 'text-[var(--color-primary)]'
                      : 'text-zinc-600 dark:text-zinc-300'
                  }
                >
                  {it.label}
                </span>

                {/* tiny active indicator */}
                <span
                  className={
                    'absolute -top-1 h-1.5 w-1.5 rounded-full transition ' +
                    (active ? 'bg-[var(--color-primary)]' : 'bg-transparent')
                  }
                />
              </Link>
            </li>
          );
        })}
      </ul>

      {/* iOS home-bar spacer */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );

  return (
    <>
      {TopTabs}
      {BottomTabs}
    </>
  );
}
