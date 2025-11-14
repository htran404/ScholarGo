import React, { useState, useMemo } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Scholarship, Role } from '../types';
import { BookmarkIcon, BookmarkSolidIcon } from '../components/icons/Icons';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../hooks/useTranslations';
import type { TranslationKey } from '../hooks/useTranslations';

const ScholarshipDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, addCommentToScholarship, toggleCommentVisibility, isScholarshipSaved, toggleSaveScholarship, getScholarshipById } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslations();
  
  const scholarship = useMemo(() => id ? getScholarshipById(id) : undefined, [id, getScholarshipById]);
  
  const [newComment, setNewComment] = useState('');
  
  if (!scholarship) {
    return <Navigate to="/404" />;
  }

  const saved = isScholarshipSaved(scholarship.id);

  const displayAmount = useMemo(() => {
    if (language === 'vi') {
        const amountVND = scholarship.amount * 25000;
        return `${amountVND.toLocaleString('vi-VN')} ₫`;
    }
    return `$${scholarship.amount.toLocaleString('en-US')}`;
  }, [language, scholarship.amount]);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      addCommentToScholarship(scholarship.id, newComment);
      setNewComment('');
    }
  };
  
  const handleToggleVisibility = (commentId: string) => {
    if (user?.role !== Role.MODDER) return;
    toggleCommentVisibility(scholarship.id, commentId);
  };
  
  const commentsToShow = useMemo(() => {
    if (!scholarship) return [];
    if (user?.role === Role.ADMIN || user?.role === Role.MODDER) {
        return scholarship.comments; // Admins and Mods see all
    }
    return scholarship.comments.filter(comment => !comment.isHidden); // Users see only visible
  }, [scholarship.comments, user]);

  const visibleCommentCount = useMemo(() => {
      if (!scholarship) return 0;
      return scholarship.comments.filter(comment => !comment.isHidden).length;
  }, [scholarship.comments]);


  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden">
        <img src={scholarship.imageUrl} alt={scholarship.title[language]} className="w-full h-64 object-cover" />
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">{scholarship.title[language]}</h1>
                <p className="text-md text-slate-500 dark:text-slate-400 mt-1">{scholarship.organization[language]}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                    {scholarship.tags.map(tagKey => (
                        <span key={tagKey} className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                            {/* Fix: Cast dynamic key to TranslationKey to resolve TypeScript overload error. */}
                            {t(`tag_${tagKey}` as TranslationKey)}
                        </span>
                    ))}
                </div>
            </div>
            {user && (
                <button
                    onClick={() => toggleSaveScholarship(scholarship.id)}
                    className="flex items-center space-x-2 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex-shrink-0 ml-4"
                >
                    {saved ? <BookmarkSolidIcon/> : <BookmarkIcon/>}
                    <span>{saved ? t('savedSuccess') : t('save')}</span>
                </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 text-center">
            <div className="bg-blue-50 dark:bg-blue-900/50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-semibold">{t('amount')}</p>
              <p className="text-2xl font-bold">{displayAmount}</p>
            </div>
             <div className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
              <p className="text-sm text-slate-800 dark:text-slate-300 font-semibold">{t('uploaded')}</p>
              <p className="text-xl font-bold">{new Date(scholarship.dateUploaded).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mt-8 prose dark:prose-invert max-w-none">
            <h2 className="text-xl font-semibold">{t('description')}</h2>
            <p>{scholarship.description[language]}</p>
            
            <h2 className="text-xl font-semibold">{t('eligibility')}</h2>
            <ul>
              {scholarship.eligibility[language].map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </div>
          
          <div className="mt-8 text-center">
            <a href={scholarship.website} target="_blank" rel="noopener noreferrer" className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105">
                {t('visitWebsite')}
            </a>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-10 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">{t('comments', { count: visibleCommentCount })}</h2>
        
        {!user && (
            <p className="mb-6 text-slate-500 dark:text-slate-400">
                {t('signInToComment', { link: <Link to="/signin" className="text-blue-500 hover:underline">{t('signedIn')}</Link> })}
            </p>
        )}

        {user && user.isLocked && (
            <div className="p-4 mb-6 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 rounded-lg">
                {t('youAreLocked')}
            </div>
        )}

        {user && !user.isLocked && scholarship.commentsLocked && (
            <div className="p-4 mb-6 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-lg">
                {t('commentsAreLocked')}
            </div>
        )}

        {user && !user.isLocked && !scholarship.commentsLocked && (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={t('writeComment') as string}
              className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              rows={3}
            ></textarea>
            <button type="submit" className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-400" disabled={!newComment.trim()}>
              {t('postComment')}
            </button>
          </form>
        )}

        <div className="space-y-4">
          {commentsToShow.length > 0 ? (
            commentsToShow.slice().reverse().map(comment => (
              <div key={comment.id} className={`p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg flex justify-between items-start transition-opacity ${comment.isHidden ? 'opacity-60' : ''}`}>
                <div>
                  <div className="flex items-center mb-2">
                    <p className="font-semibold text-blue-600 dark:text-blue-400">{comment.userFullName}</p>
                    {(user?.role === Role.ADMIN || user?.role === Role.MODDER) && comment.isHidden && <span className="text-xs ml-2 bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-2 py-0.5 rounded-full font-medium">{t('hidden')}</span>}
                  </div>
                  <p className="text-xs text-slate-500 mb-2">{new Date(comment.timestamp).toLocaleString()}</p>
                  <p>{comment.text}</p>
                </div>
                {user?.role === Role.MODDER && (
                  <button 
                    onClick={() => handleToggleVisibility(comment.id)} 
                    className="text-sm font-medium ml-4 flex-shrink-0"
                    aria-label={`Toggle visibility for comment by ${comment.userFullName}`}
                  >
                    {comment.isHidden ? 
                        <span className="text-green-500 hover:text-green-700 dark:hover:text-green-400">{t('show')}</span> :
                        <span className="text-red-500 hover:text-red-700 dark:hover:text-red-400">{t('hide')}</span>
                    }
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-slate-500">{t('noComments')}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScholarshipDetailPage;
