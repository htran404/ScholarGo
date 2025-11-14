
import React, { useMemo, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ScholarshipCard from '../components/ScholarshipCard';
import { Link } from 'react-router-dom';
import { useTranslations } from '../hooks/useTranslations';
// FIX: Corrected the import for GoogleGenAI.
// FIX: Imported `Type` to use for defining a response schema for structured JSON output.
import { GoogleGenAI, Type } from '@google/genai';
import { Scholarship } from '../types';

const SavedScholarshipsPage: React.FC = () => {
  const { user, getAllScholarships } = useAuth();
  const { t } = useTranslations();
  const allScholarships = getAllScholarships();

  const [recommendedScholarships, setRecommendedScholarships] = useState<Scholarship[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [recsError, setRecsError] = useState<string | null>(null);


  const savedScholarships = useMemo(() => {
    if (!user) return [];
    return [...allScholarships]
      .filter(scholarship => user.savedScholarshipIds.includes(scholarship.id))
      .sort((a, b) => new Date(b.dateUploaded).getTime() - new Date(a.dateUploaded).getTime());
  }, [user, allScholarships]);

  const handleGetRecommendations = async () => {
    if (!user) return;

    setRecsLoading(true);
    setRecsError(null);
    setRecommendedScholarships([]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const userProfile = `
        - Full Name: ${user.fullName}
        - Organization: ${user.optionalInfo?.organization || 'Not specified'}
        - Currently Saved Scholarships (indicating interests): ${
          user.savedScholarshipIds
            .map(id => allScholarships.find(s => s.id === id)?.title['en'])
            .filter(Boolean)
            .join(', ') || 'None'
        }
      `;

      const scholarshipsList = allScholarships.map(s => ({
        id: s.id,
        title: s.title.en,
        description: s.description.en,
        eligibility: s.eligibility.en,
        tags: s.tags
      }));

      const prompt = `
        You are an expert scholarship advisor. Your task is to recommend the best-suited scholarships for a student based on their profile.
        
        Here is the student's profile:
        ${userProfile}

        Here is a list of available scholarships in JSON format:
        ${JSON.stringify(scholarshipsList, null, 2)}

        Analyze the student's profile and interests against the available scholarships. Identify up to 3 scholarships that are the strongest match. Do not recommend scholarships that are already in the "Currently Saved Scholarships" list.
        
        Your response MUST be a valid JSON array containing only the string IDs of your recommended scholarships. Do not include any other text, explanation, or markdown.
        
        Example response format: ["scholarship-1", "scholarship-15", "scholarship-4"]
      `;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          // FIX: Added a responseSchema to enforce the JSON output structure, ensuring the AI returns a valid array of scholarship IDs.
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },
        }
      });

      const recommendedIds = JSON.parse(response.text.trim()) as string[];
      
      if (recommendedIds && recommendedIds.length > 0) {
        const recommendations = allScholarships.filter(s => recommendedIds.includes(s.id));
        setRecommendedScholarships(recommendations);
      } else {
        setRecsError("We couldn't find any specific new recommendations for you at this time.");
      }

    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      setRecsError("Sorry, we couldn't generate recommendations. Please try again later.");
    } finally {
      setRecsLoading(false);
    }
  };

  const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
  );

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

      {/* AI Recommendations Section */}
      <div className="mt-16">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md text-center border border-slate-200 dark:border-slate-700">
              <h2 className="text-2xl font-bold mb-2">Need a Recommendation?</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-2xl mx-auto">Let our AI assistant analyze your profile and saved items to suggest other scholarships you might be interested in.</p>
              <button 
                  onClick={handleGetRecommendations} 
                  disabled={recsLoading}
                  className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:bg-slate-400 disabled:cursor-wait"
              >
                  {recsLoading ? 'Analyzing...' : 'Get AI Recommendations'}
              </button>

              {recsLoading && (
                  <div className="mt-8 flex justify-center">
                      <LoadingSpinner />
                  </div>
              )}
              
              {recsError && !recsLoading && (
                  <p className="mt-8 text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md inline-block">{recsError}</p>
              )}

              {recommendedScholarships.length > 0 && !recsLoading && (
                  <div className="mt-8 text-left">
                    <h3 className="text-xl font-bold mb-4 text-center">Here are a few suggestions for you:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {recommendedScholarships.map(scholarship => (
                            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
                        ))}
                    </div>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};

export default SavedScholarshipsPage;