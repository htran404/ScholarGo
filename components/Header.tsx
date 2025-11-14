import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../hooks/useAuth';
import { SunIcon, MoonIcon, UserCircleIcon, TranslateIcon } from './icons/Icons';
import { Role } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../hooks/useTranslations';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslations();

  const activeLinkClass = "text-blue-500 dark:text-blue-400 font-semibold";
  const inactiveLinkClass = "hover:text-blue-500 dark:hover:text-blue-400 transition-colors";

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {user?.role === Role.ADMIN ? (
             <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {t('scholarGo')}
              </span>
          ) : (
            <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {t('scholarGo')}
            </Link>
          )}

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {user?.role !== Role.ADMIN && (
              <>
                <NavLink to="/" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>{t('home')}</NavLink>
                <NavLink to="/search" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>{t('search')}</NavLink>
                {user && <NavLink to="/saved" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>{t('saved')}</NavLink>}
                <NavLink to="/about" className={({ isActive }) => isActive ? activeLinkClass : inactiveLinkClass}>{t('aboutUs')}</NavLink>
              </>
            )}
          </nav>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center space-x-1"
              aria-label="Toggle language"
            >
              <TranslateIcon />
              <span className="text-sm font-medium">{language.toUpperCase()}</span>
            </button>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <SunIcon /> : <MoonIcon />}
            </button>
            {user ? (
              <div className="relative group">
                <Link to={user.role === Role.ADMIN ? '#' : '/account'} className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700">
                  <UserCircleIcon/>
                  <span className="text-sm font-medium hidden sm:block">{user.fullName}</span>
                </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 invisible group-hover:visible">
                    {user.role !== Role.ADMIN && (
                      <Link to="/account" className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">{t('myAccount')}</Link>
                    )}
                    <button onClick={logout} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                        {t('signOut')}
                    </button>
                </div>
              </div>
            ) : (
              <div className="space-x-2 text-sm">
                <Link to="/signin" className="px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{t('signIn')}</Link>
                <Link to="/signup" className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors">{t('signUp')}</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;