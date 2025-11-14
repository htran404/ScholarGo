import React, { useState, useMemo } from 'react';
import { Scholarship } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { useLanguage } from '../hooks/useLanguage';
import { TAG_KEYS } from '../constants';
import type { TranslationKey } from '../hooks/useTranslations';

type ScholarshipFormData = Omit<Scholarship, 'id' | 'comments' | 'dateUploaded' | 'commentsLocked'>;

interface ScholarshipFormProps {
    onSubmit: (data: ScholarshipFormData) => void;
    onCancel: () => void;
    initialData?: Scholarship | null;
}

const ScholarshipForm: React.FC<ScholarshipFormProps> = ({ onSubmit, onCancel, initialData }) => {
    const { t } = useTranslations();
    const { language } = useLanguage();
    const [formData, setFormData] = useState<ScholarshipFormData>({
        title: initialData?.title || { en: '', vi: '' },
        organization: initialData?.organization || { en: '', vi: '' },
        description: initialData?.description || { en: '', vi: '' },
        eligibility: initialData?.eligibility || { en: [], vi: [] },
        amount: initialData?.amount || 0,
        imageUrl: initialData?.imageUrl || '',
        website: initialData?.website || '',
        tags: initialData?.tags || [],
    });

    const sortedTagKeys = useMemo(() => {
        return [...TAG_KEYS].sort((a, b) =>
            // Fix: Cast dynamic key to TranslationKey and the result to string to resolve TypeScript error.
            (t(`tag_${a}` as TranslationKey) as string).localeCompare(t(`tag_${b}` as TranslationKey) as string)
        );
    }, [t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [field, lang] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [field]: { ...(prev[field as keyof typeof prev] as object), [lang]: value }
            }));
        } else if (name === 'amount') {
            const numericValue = Number(value);
            const amountInUSD = language === 'vi' ? numericValue / 25000 : numericValue;
            setFormData(prev => ({ ...prev, amount: amountInUSD }));
        }
        else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleEligibilityChange = (e: React.ChangeEvent<HTMLTextAreaElement>, lang: 'en' | 'vi') => {
        const { value } = e.target;
        const eligibilityArray = value.split('\n').filter(line => line.trim() !== '');
        setFormData(prev => ({
            ...prev,
            eligibility: { ...prev.eligibility, [lang]: eligibilityArray }
        }));
    };

    const handleTagToggle = (tagKey: string) => {
        setFormData(prev => {
            const newTags = prev.tags.includes(tagKey)
                ? prev.tags.filter(t => t !== tagKey)
                : [...prev.tags, tagKey];
            return { ...prev, tags: newTags };
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };
    
    const displayAmountValue = language === 'vi' 
        ? (formData.amount * 25000).toFixed(0)
        : formData.amount;
        
    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md shadow-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500";
    const labelClass = "block text-sm font-medium text-slate-600 dark:text-slate-300";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className={labelClass}>{t('titleEn')}</label>
                    <input type="text" name="title.en" value={formData.title.en} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('titleVi')}</label>
                    <input type="text" name="title.vi" value={formData.title.vi} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('organizationEn')}</label>
                    <input type="text" name="organization.en" value={formData.organization.en} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('organizationVi')}</label>
                    <input type="text" name="organization.vi" value={formData.organization.vi} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('descriptionEn')}</label>
                    <textarea name="description.en" value={formData.description.en} onChange={handleChange} required className={inputClass} rows={4}></textarea>
                </div>
                <div>
                    <label className={labelClass}>{t('descriptionVi')}</label>
                    <textarea name="description.vi" value={formData.description.vi} onChange={handleChange} required className={inputClass} rows={4}></textarea>
                </div>
                 <div>
                    <label className={labelClass}>{t('eligibilityEn')}</label>
                    <textarea value={formData.eligibility.en.join('\n')} onChange={(e) => handleEligibilityChange(e, 'en')} required className={inputClass} rows={4}></textarea>
                    <p className="text-xs text-slate-500 mt-1">{t('eligibilityHint')}</p>
                </div>
                <div>
                    <label className={labelClass}>{t('eligibilityVi')}</label>
                    <textarea value={formData.eligibility.vi.join('\n')} onChange={(e) => handleEligibilityChange(e, 'vi')} required className={inputClass} rows={4}></textarea>
                     <p className="text-xs text-slate-500 mt-1">{t('eligibilityHint')}</p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className={labelClass}>{t('amountNum')}</label>
                    <input type="number" name="amount" value={displayAmountValue} onChange={handleChange} required className={inputClass} />
                </div>
                <div>
                    <label className={labelClass}>{t('imageUrl')}</label>
                    <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} required className={inputClass} />
                </div>
            </div>
            <div>
                <label className={labelClass}>{t('websiteUrl')}</label>
                <input type="text" name="website" value={formData.website} onChange={handleChange} required className={inputClass} />
            </div>
             <div>
                <label className={labelClass}>{t('tags')}</label>
                <div className="mt-2 flex flex-wrap gap-2 p-3 border border-slate-300 dark:border-slate-700 rounded-md bg-slate-50 dark:bg-slate-900/50">
                    {sortedTagKeys.map(tagKey => {
                        const isSelected = formData.tags.includes(tagKey);
                        return (
                            <button
                                type="button"
                                key={tagKey}
                                onClick={() => handleTagToggle(tagKey)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${
                                    isSelected
                                        ? 'bg-blue-600 text-white shadow-sm'
                                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600'
                                }`}
                            >
                                {/* Fix: Cast dynamic key to TranslationKey to resolve TypeScript overload error. */}
                                {t(`tag_${tagKey}` as TranslationKey)}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div className="flex justify-end space-x-4">
                <button type="button" onClick={onCancel} className="px-6 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">
                    {t('cancel')}
                </button>
                <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {t('saveChanges')}
                </button>
            </div>
        </form>
    );
};

export default ScholarshipForm;