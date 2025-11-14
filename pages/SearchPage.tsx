import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import ScholarshipCard from '../components/ScholarshipCard';
import { Scholarship } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../hooks/useTranslations';
import { TAG_KEYS } from '../constants';
import type { TranslationKey } from '../hooks/useTranslations';

const SearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const { language } = useLanguage();
  const { t } = useTranslations();
  const { getAllScholarships } = useAuth();
  const allScholarships = getAllScholarships();

  const sortedTagKeys = useMemo(() => {
    return [...TAG_KEYS].sort((a, b) => 
        // Fix: Cast dynamic key to TranslationKey and the result to string to resolve TypeScript error.
        (t(`tag_${a}` as TranslationKey) as string).localeCompare(t(`tag_${b}` as TranslationKey) as string)
    );
  }, [t]);

  const filteredAndSortedScholarships = useMemo(() => {
    return [...allScholarships]
      .filter(scholarship => {
        // Tag filter for multi-select
        if (selectedTags.length > 0 && !scholarship.tags.some(tag => selectedTags.includes(tag))) {
            return false;
        }

        // Search term filter
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        if (!lowerCaseSearchTerm) return true; // No search term, so don't filter by it
        
        return (
          scholarship.title[language].toLowerCase().includes(lowerCaseSearchTerm) ||
          scholarship.organization[language].toLowerCase().includes(lowerCaseSearchTerm) ||
          scholarship.description[language].toLowerCase().includes(lowerCaseSearchTerm)
        );
      })
      .sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
  }, [searchTerm, selectedTags, language, allScholarships]);
  
  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTags, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedScholarships.length / itemsPerPage);

  const paginatedScholarships = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedScholarships.slice(startIndex, startIndex + itemsPerPage);
  }, [currentPage, itemsPerPage, filteredAndSortedScholarships]);


  const handleTagClick = (tagKey: string) => {
    setSelectedTags(prev => 
        prev.includes(tagKey) 
            ? prev.filter(t => t !== tagKey) 
            : [...prev, tagKey]
    );
  };

  const tagButtonClass = (tagKey: string, isAllButton: boolean = false) => {
    const isActive = isAllButton ? selectedTags.length === 0 : selectedTags.includes(tagKey);
    return `px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive 
        ? 'bg-blue-500 text-white' 
        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
    }`;
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const itemsPerPageOptions = [10, 50, 100];
  
  const startItem = filteredAndSortedScholarships.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(currentPage * itemsPerPage, filteredAndSortedScholarships.length);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxPagesToShow = 5;
    const halfPagesToShow = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, currentPage + halfPagesToShow);

    if (currentPage - 1 <= halfPagesToShow) {
        endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (totalPages - currentPage <= halfPagesToShow) {
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
    }

    return (
        <nav className="mt-8 flex justify-center items-center space-x-1" aria-label="Pagination">
            <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
                {t('previous')}
            </button>
            {pageNumbers.map((num, index) =>
                typeof num === 'number' ? (
                    <button 
                        key={`${num}-${index}`}
                        onClick={() => handlePageChange(num)}
                        className={`px-4 py-2 rounded-md border text-sm ${
                            currentPage === num 
                                ? 'bg-blue-500 text-white border-blue-500' 
                                : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {num}
                    </button>
                ) : (
                    <span key={`ellipsis-${index}`} className="px-2 py-2 text-slate-500">...</span>
                )
            )}
            <button 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-md bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm hover:bg-slate-50 dark:hover:bg-slate-700"
            >
                {t('next')}
            </button>
        </nav>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">{t('findScholarships')}</h1>
      <p className="text-slate-500 dark:text-slate-400 mb-6">{t('searchPrompt')}</p>
      
      <div className="mb-6">
        <input
          type="text"
          placeholder={t('searchInputPlaceholder') as string}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        <button onClick={() => setSelectedTags([])} className={tagButtonClass('', true)}>
          {t('all')}
        </button>
        {sortedTagKeys.map(tagKey => (
          <button key={tagKey} onClick={() => handleTagClick(tagKey)} className={tagButtonClass(tagKey)}>
            {/* Fix: Cast dynamic key to TranslationKey to resolve TypeScript overload error. */}
            {t(`tag_${tagKey}` as TranslationKey)}
          </button>
        ))}
      </div>

      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">
            {t('scholarshipsFound', { count: filteredAndSortedScholarships.length })}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-slate-500 dark:text-slate-400">{t('itemsPerPage')}</span>
            <div className="flex items-center rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800">
                {itemsPerPageOptions.map(option => (
                    <button 
                        key={option}
                        onClick={() => setItemsPerPage(option)}
                        className={`px-3 py-1 text-sm font-medium transition-colors first:rounded-l-sm last:rounded-r-sm border-r border-slate-300 dark:border-slate-700 last:border-r-0 ${
                            itemsPerPage === option
                                ? 'bg-blue-500 text-white'
                                : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                    >
                        {option}
                    </button>
                ))}
            </div>
          </div>
        </div>

        {filteredAndSortedScholarships.length > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              {t('showingResults', { start: startItem, end: endItem, total: filteredAndSortedScholarships.length })}
          </p>
        )}

        {filteredAndSortedScholarships.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedScholarships.map(scholarship => (
                <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
              ))}
            </div>
            {renderPagination()}
          </>
        ) : (
          <div className="text-center py-16 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <p className="text-xl text-slate-600 dark:text-slate-400">{t('noScholarshipsFound')}</p>
            <p className="text-slate-500 mt-2">{t('noScholarshipsHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;