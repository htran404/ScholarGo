import React from 'react';
import { useLanguage } from './useLanguage';
import { translations } from '../i18n/translations';

// Define types for better type safety
type AllTranslationKeys = keyof typeof translations['en'];

// FIX: Export a refined `TranslationKey` type that excludes keys with non-renderable return types (like 'teamMembers').
// This allows components using dynamic keys (e.g., for tags) to correctly resolve the `t` function overload
// to the one returning `React.ReactNode`, preventing TypeScript errors.
export type TranslationKey = Exclude<AllTranslationKeys, 'teamMembers'>;
type TeamMember = { name: string; role: string; bio: string; };

export const useTranslations = () => {
  const { language } = useLanguage();

  // FIX: Overload the `t` function to provide specific return types.
  // This resolves TypeScript errors where the inferred return type was too broad
  // and included non-renderable types (like `TeamMember[]`) for rendering contexts.
  function t(key: 'teamMembers'): TeamMember[];
  function t(key: TranslationKey, replacements?: { [key: string]: string | number | React.ReactNode }): React.ReactNode;
  function t(key: AllTranslationKeys, replacements?: { [key: string]: string | number | React.ReactNode }): React.ReactNode | TeamMember[] {
    const text = translations[language][key] || translations.en[key];

    if (typeof text !== 'string') {
        // This path is taken for 'teamMembers' which returns a data array.
        return text;
    }

    if (replacements) {
        // FIX: The original reduce-based implementation was flawed. It incorrectly assumed that only the last element
        // of an array needed processing and didn't handle non-string (ReactNode) elements, leading to the '.split is not a function' error.
        // This new implementation correctly processes all parts of the translation string.
        let result: (string | React.ReactNode)[] = [text];

        for (const [rKey, value] of Object.entries(replacements)) {
            const regex = new RegExp(`{${rKey}}`, 'g');
            const newResult: (string | React.ReactNode)[] = [];

            for (const part of result) {
                if (typeof part === 'string') {
                    const splitParts = part.split(regex);
                    for (let i = 0; i < splitParts.length; i++) {
                        newResult.push(splitParts[i]);
                        if (i < splitParts.length - 1) {
                            newResult.push(value);
                        }
                    }
                } else {
                    newResult.push(part);
                }
            }
            result = newResult;
        }
        return result;
    }
    return text;
  };

  return { t };
};
