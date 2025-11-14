import React, { useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import ScholarshipCard from '../components/ScholarshipCard';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';

const SavedScholarshipsPage: React.FC = () => {
  const { user, getAllScholarships } = useAuth();
  const { t } = useTranslations();
  const allScholarships = getAllScholarships();

  const savedScholarships = useMemo(() => {
    if (!user) return [];
    return [...allScholarships]
      .filter(scholarship => user.savedScholarshipIds.includes(scholarship.id))
      .sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
  }, [user, allScholarships]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('mySavedScholarships')}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">
        {t('savedPrompt')}
      </p>

      {savedScholarships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedScholarships.map(scholarship => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <p className="text-xl text-slate-600 dark:text-slate-400">{t('noSavedScholarships')}</p>
          <p className="text-slate-500 mt-2">
            {t('noSavedHint')}
          </p>
          <Link
            to="/search"
            className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            {t('findScholarships')}
          </Link>
        </div>
      )}
    </div>
  );
};

export default SavedScholarshipsPage;