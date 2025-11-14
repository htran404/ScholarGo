
import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

const Footer: React.FC = () => {
  const { t } = useTranslations();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center text-sm text-slate-500 dark:text-slate-400">
          <p>{t('copyright', { year })}</p>
          <p className="mt-1">{t('createdBy')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
