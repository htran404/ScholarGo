
import React from 'react';
import { Link } from 'react-router-dom';
import { SearchIcon, SaveIcon, ExternalLinkIcon } from '../components/icons/Icons';
import { useTranslations } from '../hooks/useTranslations';

const HomePage: React.FC = () => {
  const { t } = useTranslations();
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center bg-blue-100 dark:bg-blue-900/30 rounded-lg flex flex-col items-center justify-center min-h-[60vh] py-16 px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-blue-800 dark:text-blue-300">{t('heroTitle')}</h1>
        <p className="mt-6 text-lg md:text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
          {t('heroSubtitle')}
        </p>
        <Link 
          to="/search"
          className="mt-10 inline-block bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full transition-transform transform hover:scale-105 text-lg"
        >
          {t('discoverScholarships')}
        </Link>
      </section>

      {/* Our Mission Section */}
      <section className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{t('ourMissionTitle')}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {t('ourMissionText')}
          </p>
      </section>

      {/* How It Works Section */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-10">{t('howItWorksTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <SearchIcon />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('searchStepTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('searchStepText')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <SaveIcon />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('saveStepTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400">
             {t('saveStepText')}
            </p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full">
                <ExternalLinkIcon />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('applyStepTitle')}</h3>
            <p className="text-slate-500 dark:text-slate-400">
              {t('applyStepText')}
            </p>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
       <section className="text-center bg-slate-100 dark:bg-slate-800 p-10 rounded-lg">
        <h2 className="text-3xl font-bold">{t('ctaTitle')}</h2>
        <p className="mt-2 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {t('ctaSubtitle')}
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <Link 
              to="/signup"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              {t('createAccount')}
            </Link>
             <Link 
              to="/search"
              className="inline-block bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 font-bold py-3 px-6 rounded-full transition-colors"
            >
              {t('browseScholarships')}
            </Link>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
