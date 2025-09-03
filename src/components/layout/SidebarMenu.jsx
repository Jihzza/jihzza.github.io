// src/components/layout/SidebarMenu.jsx

import React, { Fragment, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, Cog6ToothIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { signOut } from '../../services/authService';
import { useTranslation } from 'react-i18next';

// Static hrefs (labels come from i18n)
const mainPagesHrefs = ['/', '/profile', '/messages', '/calendar', '/chatbot'];
const exploreLinksHrefs = [
  '/#consultations-section', '/#coaching-section', '/#invest-section',
  '/#testimonials-section', '/#media-appearances-section', '/#other-wins-section',
  '/#interactive-sections', '/#interactive-sections', '/#interactive-sections'
];

export default function SidebarMenu({ isOpen, onClose, isAuthenticated = true, style }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const closeButtonRef = useRef(null);

  // Build sections from i18n labels + static hrefs
  const mainPages = (t('sidebar.mainPages', { returnObjects: true }) || []).map((item, index) => ({
    ...item,
    href: mainPagesHrefs[index]
  }));
  const exploreLinks = (t('sidebar.exploreLinks', { returnObjects: true }) || []).map((item, index) => ({
    ...item,
    href: exploreLinksHrefs[index]
  }));

  const isActive = (href) => {
    if (!href) return false;
    const [path] = href.split('#');
    return location.pathname === (path || href);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose?.();
    navigate('/login');
  };

  const handleLinkClick = (href) => {
    onClose?.();
    if (href.includes('#')) {
      const [path, id] = href.split('#');
      if (path && location.pathname !== path) {
        navigate(path);
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(href);
    }
  };

  const itemBase =
    'flex items-center gap-3 rounded-xl px-3 py-2 text-base md:text-lg lg:text-base transition-colors outline-none hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-yellow-400/70';

  const authColorClasses = isAuthenticated
    ? 'text-red-400 hover:text-red-300 focus-visible:ring-red-400/70'        // Log Out
    : 'text-green-300 hover:text-emerald-300 focus-visible:ring-emerald-400/70'; // Log In (positive)

  // A "danger" variant so the red hover doesn’t conflict with itemBase’s yellow hover
  const dangerItem =
    'flex items-center gap-3 rounded-xl px-3 py-2 text-base md:text-lg lg:text-base transition-colors outline-none hover:bg-white/10 focus-visible:bg-white/10 focus-visible:ring-2 focus-visible:ring-red-400/70 text-red-400 hover:text-red-300';

  return (
    <Transition show={!!isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose} initialFocus={closeButtonRef}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200" enterFrom="opacity-0" enterTo="opacity-100"
          leave="ease-in duration-150" leaveFrom="opacity-100" leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </Transition.Child>

        {/* Slide-over */}
        <div className="fixed inset-0 flex">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-out duration-300" enterFrom="-translate-x-full" enterTo="translate-x-0"
            leave="transform transition ease-in duration-200" leaveFrom="translate-x-0" leaveTo="-translate-x-full"
          >
            <Dialog.Panel
              style={style}
              className="pointer-events-auto relative h-full w-[78vw] sm:w-[380px] lg:w-[420px] bg-black text-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 md:px-6 md:py-4 border-b border-white/10 lg:py-1">
                <Dialog.Title className="text-sm md:text-lg lg:text-base font-semibold tracking-wide text-yellow-400">
                  {t('sidebar.title', { defaultValue: 'Menu' })}
                </Dialog.Title>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center rounded-lg p-2 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/70"
                  aria-label={t('common.close', { defaultValue: 'Close' })}
                >
                  <XMarkIcon className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="flex h-auto flex-col px-3 py-3 md:px-5 md:py-5 lg:py-3 sidebar-scrollbar">
                <nav aria-label={t('sidebar.navigation', { defaultValue: 'Primary' })} className="flex-1">
                  {/* Main pages */}
                  <ul role="list" className="space-y-1 md:space-y-2 lg:space-y-1">
                    {mainPages.map((item) => (
                      <li key={item.label}>
                        <Link
                          to={item.href}
                          aria-current={isActive(item.href) ? 'page' : undefined}
                          onClick={(e) => {
                            e.preventDefault();
                            handleLinkClick(item.href);
                          }}
                          className={`${itemBase} ${isActive(item.href) ? 'text-yellow-400 bg-white/5' : 'text-white/90 hover:text-yellow-400'}`}
                        >
                          <span className="truncate text-base md:text-xl lg:text-base">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  {/* Explore */}
                  <div className="mt-6 md:mt-8 lg:mt-4">
                    <h2 className="px-2 text-xs md:text-base font-semibold uppercase tracking-wider text-yellow-400/90 lg:text-sm">
                      {t('sidebar.explore')}
                    </h2>
                    <ul role="list" className="mt-2 space-y-1 md:space-y-2 lg:space-y-1">
                      {exploreLinks.map((item) => (
                        <li key={item.label}>
                          <Link
                            to={item.href}
                            onClick={(e) => {
                              e.preventDefault();
                              handleLinkClick(item.href);
                            }}
                            className={`${itemBase} text-white/90 hover:text-yellow-400`}
                          >
                            <span className="truncate text-base md:text-xl lg:text-base">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>

                {/* Footer actions (auth first, then Settings) */}
                <div className="border-t border-white/10 pt-2 mt-2 space-y-2 md:pt-4 md:mt-4 lg:mt-2 lg:pt-2 lg:space-y-0">
                  <button
                    type="button"
                    onClick={isAuthenticated ? handleSignOut : () => handleLinkClick('/login')}
                    className={`${itemBase} w-full text-left ${authColorClasses}`}
                    aria-label={isAuthenticated
                      ? t('sidebar.logout', { defaultValue: 'Log Out' })
                      : t('sidebar.login', { defaultValue: 'Log In' })}
                  >
                    <ArrowRightOnRectangleIcon className="h-5 w-5 md:h-7 md:w-7 lg:h-5 lg:w-5" />
                    <span className="text-base md:text-xl lg:text-base">
                      {isAuthenticated
                        ? t('sidebar.logout', { defaultValue: 'Log Out' })
                        : t('sidebar.login', { defaultValue: 'Log In' })}
                    </span>
                  </button>


                  <Link
                    to="/settings"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick('/settings');
                    }}
                    className={`${itemBase} text-white/90 hover:text-yellow-400`}
                  >
                    <Cog6ToothIcon className="h-5 w-5 md:h-7 md:w-7 lg:h-5 lg:w-5" />
                    <span className="text-base md:text-xl lg:text-base">{t('sidebar.settings')}</span>
                  </Link>
                </div>

              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
