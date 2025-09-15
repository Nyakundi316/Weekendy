'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import {
  Home,
  Heart,
  ScanLine,
  Ticket,
  User,
  Search,
  Bell,
} from 'lucide-react';

export default function AppTabs() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const items = useMemo(
    () => ([
      { href: '/',           label: 'Home',     icon: Home },
      { href: '/discover',   label: 'Discover', icon: Heart },
      { href: '/scan',       label: 'Scan',     icon: ScanLine, primary: true },
      { href: '/tickets',    label: 'Tickets',  icon: Ticket },
      { href: '/profile',    label: 'Profile',  icon: User },
    ]),
    []
  );

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  // Enhanced Desktop Navigation with white background and curved design
  const DesktopNav = (
    <nav
      aria-label="Primary"
      className={`hidden lg:flex fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-lg shadow-lg rounded-2xl py-2 px-4 border border-gray-100' 
          : 'bg-white rounded-2xl shadow-md py-3 px-5'
      }`}
      style={{ width: isScrolled ? '90%' : '95%', maxWidth: '1200px' }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
            <Ticket className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Eventify
          </span>
        </Link>

        {/* Navigation Items - Centered */}
        <div className="flex items-center gap-1 bg-gray-100/80 backdrop-blur-sm rounded-xl px-2 py-1">
          {items.map((it) => {
            const Icon = it.icon;
            const active = isActive(it.href);
            
            if (it.primary) {
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  className="flex flex-col items-center mx-2"
                >
                  <div className={`grid place-items-center h-12 w-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-300 ${
                    isScrolled ? 'hover:scale-105' : 'hover:scale-110'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </Link>
              );
            }

            return (
              <Link
                key={it.href}
                href={it.href}
                className={[
                  'inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 mx-1',
                  active
                    ? 'bg-orange-500 text-white shadow-inner'
                    : 'text-gray-600 hover:text-orange-500 hover:bg-gray-200/50',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
                <span>{it.label}</span>
                
                {/* Active indicator */}
                {active && (
                  <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-orange-500" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-200/50 transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button className="p-2 rounded-lg text-gray-600 hover:text-orange-500 hover:bg-gray-200/50 transition-colors relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] text-white flex items-center justify-center">
              3
            </span>
          </button>
          <button className="h-9 w-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center border border-gray-300/50">
            <User className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  );

  // Mobile Navigation with white background
  const MobileNav = (
    <nav
      aria-label="Primary"
      className="lg:hidden fixed inset-x-4 bottom-4 z-50 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="grid grid-cols-5 relative">
        {items.map((it, idx) => {
          const Icon = it.icon;
          const active = isActive(it.href);
          
          if (it.primary) {
            // Center "Scan" button - elevated with curved design
            return (
              <li key={it.href} className="flex items-center justify-center relative">
                <div className="absolute -top-6">
                  <Link
                    href={it.href}
                    className="flex flex-col items-center justify-center"
                  >
                    <div className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 ring-2 ring-white/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="mt-1 text-xs font-medium text-orange-600">
                      {it.label}
                    </span>
                  </Link>
                </div>
              </li>
            );
          }

          return (
            <li key={it.href}>
              <Link
                href={it.href}
                className={`group relative flex flex-col items-center justify-center gap-1 py-4 text-[11px] font-medium transition-colors ${
                  active ? 'text-orange-500' : 'text-gray-600'
                }`}
              >
                <div className={`p-2 rounded-lg transition-colors ${
                  active ? 'bg-orange-100' : 'group-hover:bg-gray-100'
                }`}>
                  <Icon
                    className={`h-5 w-5 transition-colors ${
                      active ? 'text-orange-500' : 'text-gray-500 group-hover:text-gray-700'
                    }`}
                  />
                </div>
                <span>{it.label}</span>

                {/* Active indicator */}
                {active && (
                  <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );

  return (
    <>
      {DesktopNav}
      {MobileNav}
      
      {/* Add padding to prevent content from being hidden under fixed nav */}
      <div className="lg:pt-24"></div>
    </>
  );
}