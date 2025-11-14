import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Scholarship } from '../types';
import ScholarshipForm from '../components/ScholarshipForm';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../hooks/useTranslations';

const ModderPortalPage: React.FC = () => {
    const { 
        createScholarship, 
        updateScholarship, 
        deleteScholarship, 
        toggleCommentVisibility,
        toggleScholarshipCommentLock,
        getAllScholarships,
    } = useAuth();
    const { language } = useLanguage();
    const { t } = useTranslations();
    
    const [scholarships, setScholarships] = useState<Scholarship[]>(getAllScholarships);
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingScholarship, setEditingScholarship] = useState<Scholarship | null>(null);
    const [activeTab, setActiveTab] = useState<'scholarships' | 'comments'>('scholarships');

    useEffect(() => {
        setScholarships(getAllScholarships());
    }, [getAllScholarships]);
    

    const sortedScholarships = useMemo(() => {
        return [...scholarships].sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
    }, [scholarships]);
    
    const allComments = useMemo(() => {
        return scholarships.flatMap(scholarship => 
            scholarship.comments.map(comment => ({
                ...comment,
                scholarshipId: scholarship.id,
                scholarshipTitle: scholarship.title[language]
            }))
        ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [scholarships, language]);

    const formatAmount = (amount: number) => {
        if (language === 'vi') {
            const amountVND = amount * 25000;
            return `${amountVND.toLocaleString('vi-VN')} ₫`;
        }
        return `$${amount.toLocaleString('en-US')}`;
    };

    const handleCreateNew = () => {
        setEditingScholarship(null);
        setIsFormVisible(true);
    };

    const handleEdit = (scholarship: Scholarship) => {
        setEditingScholarship(scholarship);
        setIsFormVisible(true);
    };

    const handleDelete = (scholarshipId: string) => {
        if (window.confirm(t('deleteConfirm') as string)) {
            deleteScholarship(scholarshipId);
        }
    };
    
    const handleToggleComment = (scholarshipId: string, commentId: string) => {
        toggleCommentVisibility(scholarshipId, commentId);
    };
    
    const handleToggleScholarshipCommentLock = (scholarshipId: string) => {
        toggleScholarshipCommentLock(scholarshipId);
    };
    
    const handleFormSubmit = (data: Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>) => {
        if (editingScholarship) {
            updateScholarship(editingScholarship.id, data);
        } else {
            createScholarship(data);
        }
        setIsFormVisible(false);
        setEditingScholarship(null);
    };
    
    const handleCancelForm = () => {
        setIsFormVisible(false);
        setEditingScholarship(null);
    };
    
    const tabClass = (isActive: boolean) => 
        `px-1 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${isActive 
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300' 
            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'}`;
    
    const headerClass = "p-4 font-semibold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-sm";
    const cellClass = "p-4 text-slate-600 dark:text-slate-300";

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{t('modderPortal')}</h1>
                {activeTab === 'scholarships' && !isFormVisible && (
                    <button onClick={handleCreateNew} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        {t('createNewScholarship')}
                    </button>
                )}
            </div>
            
            <div className="mb-6 border-b border-slate-300 dark:border-slate-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button onClick={() => setActiveTab('scholarships')} className={tabClass(activeTab === 'scholarships')}>
                        {t('scholarshipManagement')}
                    </button>
                    <button onClick={() => setActiveTab('comments')} className={tabClass(activeTab === 'comments')}>
                        {t('commentManagement')}
                    </button>
                </nav>
            </div>

            {activeTab === 'scholarships' && (
                isFormVisible ? (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">{editingScholarship ? t('editScholarship') : t('createNewScholarship')}</h2>
                        <ScholarshipForm 
                            onSubmit={handleFormSubmit}
                            onCancel={handleCancelForm}
                            initialData={editingScholarship}
                        />
                    </div>
                ) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-slate-50 dark:bg-slate-700">
                                <tr>
                                    <th className={headerClass}>{t('titleEn')}</th>
                                    <th className={headerClass}>{t('tags')}</th>
                                    <th className={headerClass}>{t('amountNum')}</th>
                                    <th className={headerClass}>{t('date')}</th>
                                    <th className={headerClass}>{t('commentStatus')}</th>
                                    <th className={`${headerClass} text-right`}>{t('actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedScholarships.length > 0 ? (
                                    sortedScholarships.map(s => (
                                        <tr key={s.id} className="border-b border-slate-200 dark:border-slate-700">
                                            <td className={cellClass}>{s.title[language]}</td>
                                            <td className={`${cellClass} text-xs`}>{s.tags.map(tagKey => t(`tag_${tagKey}` as any)).join(', ')}</td>
                                            <td className={cellClass}>{formatAmount(s.amount)}</td>
                                            <td className={cellClass}>{new Date(s.dateUploaded).toLocaleDateString()}</td>
                                            <td className={cellClass}>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                    s.commentsLocked 
                                                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                                    : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                }`}>
                                                    {s.commentsLocked ? t('commentsLocked') : t('commentsUnlocked')}
                                                </span>
                                            </td>
                                            <td className={`${cellClass} space-x-2 text-right`}>
                                                <button onClick={() => handleToggleScholarshipCommentLock(s.id)} className={`text-sm ${s.commentsLocked ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'} hover:underline`}>
                                                    {s.commentsLocked ? t('unlockComments') : t('lockComments')}
                                                </button>
                                                <button onClick={() => handleEdit(s)} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">{t('edit')}</button>
                                                <button onClick={() => handleDelete(s.id)} className="text-sm text-red-600 dark:text-red-400 hover:underline">{t('delete')}</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="p-8 text-center text-slate-500 dark:text-slate-400">
                                            {t('noScholarshipsFound')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            )}
            
            {activeTab === 'comments' && (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-left min-w-[800px]">
                        <thead className="bg-slate-50 dark:bg-slate-700">
                            <tr>
                                <th className={headerClass}>{t('scholarship')}</th>
                                <th className={headerClass}>{t('author')}</th>
                                <th className={headerClass}>{t('text')}</th>
                                <th className={headerClass}>{t('date')}</th>
                                <th className={headerClass}>{t('status')}</th>
                                <th className={`${headerClass} text-right`}>{t('actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allComments.map(c => (
                                <tr key={c.id} className="border-b border-slate-200 dark:border-slate-700">
                                    <td className={cellClass}>
                                        <Link to={`/scholarship/${c.scholarshipId}`} className="hover:underline text-blue-600 dark:text-blue-400" title={c.scholarshipTitle}>
                                            {c.scholarshipTitle.length > 25 ? `${c.scholarshipTitle.substring(0, 25)}...` : c.scholarshipTitle}
                                        </Link>
                                    </td>
                                    <td className={cellClass}>{c.userFullName}</td>
                                    <td className={`${cellClass} max-w-xs truncate`} title={c.text}>{c.text}</td>
                                    <td className={`${cellClass} whitespace-nowrap`}>{new Date(c.timestamp).toLocaleDateString()}</td>
                                    <td className={cellClass}>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            c.isHidden 
                                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        }`}>
                                            {c.isHidden ? t('hidden') : t('visible')}
                                        </span>
                                    </td>
                                    <td className={`${cellClass} space-x-2 text-right`}>
                                        <button onClick={() => handleToggleComment(c.scholarshipId, c.id)} className={`hover:underline ${c.isHidden ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                            {c.isHidden ? t('show') : t('hide')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ModderPortalPage;
