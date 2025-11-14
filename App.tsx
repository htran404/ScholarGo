
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import { useAuth } from './hooks/useAuth';
import ModderProtectedRoute from './components/ModderProtectedRoute';

// Lazy load page components for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const SavedScholarshipsPage = lazy(() => import('./pages/SavedScholarshipsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const ScholarshipDetailPage = lazy(() => import('./pages/ScholarshipDetailPage'));
const SignInPage = lazy(() => import('./pages/SignInPage'));
const SignUpPage = lazy(() => import('./pages/SignUpPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const AdminPortalPage = lazy(() => import('./pages/AdminPortalPage'));
const ModderPortalPage = lazy(() => import('./pages/ModderPortalPage'));

const LoadingSpinner: React.FC = () => (
  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
);

const AppContent: React.FC = () => {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-gray-950">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <LanguageProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-gray-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
          <Header />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<div className="flex justify-center items-center h-full py-20"><LoadingSpinner /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/scholarship/:id" element={<ScholarshipDetailPage />} />
                <Route path="/signin" element={<SignInPage />} />
                <Route path="/signup" element={<SignUpPage />} />
                <Route 
                  path="/saved" 
                  element={
                    <ProtectedRoute>
                      <SavedScholarshipsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/account" 
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  } 
                />
                <Route
                  path="/admin"
                  element={
                    <AdminProtectedRoute>
                      <AdminPortalPage />
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path="/modder-portal"
                  element={
                    <ModderProtectedRoute>
                      <ModderPortalPage />
                    </ModderProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </HashRouter>
    </LanguageProvider>
  );
};


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
