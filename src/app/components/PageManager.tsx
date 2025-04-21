"use client";

import React, { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import GoalsPage from './GoalsPage';
import DistractionsPage from './DistractionsPage';
import SummaryPage from './SummaryPage';
import ModernDashboard from './GameDashboard';
import { useAppContext } from '../context/AppContext';
import { useRouter } from 'next/navigation';

const PageManager: React.FC = () => {
  const { currentPage } = useAppContext();
  const router = useRouter();
  
  // Use useEffect for navigation side effects
  useEffect(() => {
    // From the AppContext, we can see currentPage is a number
    if (currentPage === 4) {
      router.push('/dashboard');
    }
  }, [currentPage, router]);
  
  const renderPage = () => {
    switch(currentPage) {
      case 4: // Dashboard
        return <ModernDashboard key="dashboard" />;
      case 0:
        return <GoalsPage key="goals" />;
      case 1:
        return <DistractionsPage key="distractions" />;
      case 2:
        return <SummaryPage key="summary" />;
      default:
        return <ModernDashboard key="dashboard" />; // Default to dashboard
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <AnimatePresence mode="wait">
        {renderPage()}
      </AnimatePresence>
    </div>
  );
};

export default PageManager; 