import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Scholarship } from '../types';
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../hooks/useTranslations';
import { BookmarkIcon, BookmarkSolidIcon } from './icons/Icons';
import type { TranslationKey } from '../hooks/useTranslations';

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

const ScholarshipCard: React.FC<ScholarshipCardProps> = ({ scholarship }) => {
  const { user, isScholarshipSaved, toggleSaveScholarship } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslations();

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveScholarship(scholarship.id);
  }

  const saved = isScholarshipSaved(scholarship.id);

  const displayAmount = useMemo(() => {
    if (language === 'vi') {
        const amountVND = scholarship.amount * 25000;
        return `${amountVND.toLocaleString('vi-VN')} ₫`;
    }
    return `$${scholarship.amount.toLocaleString('en-US')}`;
  }, [language, scholarship.amount]);

  return (
    <Link to={`/scholarship/${scholarship.id}`} className="block group">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full flex flex-col">
        <div className="relative">
            <img src={scholarship.imageUrl} alt={scholarship.title[language]} className="w-full h-40 object-cover" />
            <div className="absolute top-0 right-0 p-2">
            {user && (
                <button
                    onClick={handleSaveClick}
                    className="p-2 bg-white/70 dark:bg-slate-900/70 rounded-full hover:bg-white dark:hover:bg-slate-900 transition-colors"
                    aria-label={saved ? 'Unsave scholarship' : 'Save scholarship'}
                >
                {saved ? <BookmarkSolidIcon /> : <BookmarkIcon />}
                </button>
            )}
            </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-blue-600 dark:text-blue-400 group-hover:underline">{scholarship.title[language]}</h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{scholarship.organization[language]}</p>
          <div className="mt-2 flex flex-wrap gap-1">
              {scholarship.tags.slice(0, 3).map(tagKey => (
                  <span key={tagKey} className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium px-2 py-0.5 rounded">
                      {/* Fix: Cast dynamic key to TranslationKey to resolve TypeScript overload error. */}
                      {t(`tag_${tagKey}` as TranslationKey)}
                  </span>
              ))}
          </div>
          <div className="mt-4 flex-grow">
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {displayAmount}
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">
            {t('uploaded')}: {new Date(scholarship.dateUploaded).toLocaleDateString()}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ScholarshipCard;