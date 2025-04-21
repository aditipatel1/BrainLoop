"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import { useAppContext } from '../context/AppContext';
import TaskItem from './TaskItem';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children?: React.ReactNode;
}

// Simple component to display distraction items
const DistractionItem = ({ title, description, timeLimit }: { title: string, description: string, timeLimit: number }) => {
  return (
    <div className="bg-gray-800 border border-red-500/30 rounded-lg p-4 mb-3">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-sm text-gray-300 mt-2">{description}</p>
      {timeLimit > 0 && (
        <p className="text-sm text-gray-300 mt-2">Time Limit: {timeLimit} hours</p>
      )}
    </div>
  );
};

const Popup: React.FC<PopupProps> = ({ isOpen, onClose, title, children }) => {
  const { goals, distractions } = useAppContext();
  
  // Render content based on popup title
  const renderPopupContent = () => {
    if (children) return children;
    
    if (title === 'Tasks') {
      // Sort goals: incomplete tasks first, then completed tasks
      const sortedGoals = [...goals].sort((a, b) => {
        if (a.isCompleted === b.isCompleted) return 0;
        return a.isCompleted ? 1 : -1;
      });

      return (
        <div className="space-y-2">
          {sortedGoals.length > 0 ? (
            sortedGoals.map((goal) => (
              <TaskItem
                key={goal.id}
                title={goal.name}
                isCompleted={goal.isCompleted}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p>No tasks added yet. Go to Goals page to add tasks!</p>
            </div>
          )}
        </div>
      );
    }
    
    if (title === 'Distractions') {
      return (
        <div className="space-y-2">
          {distractions.length > 0 ? (
            distractions.map((distraction) => (
              <DistractionItem
                key={distraction.id}
                title={distraction.name}
                description={distraction.description || ''}
                timeLimit={distraction.timeLimit ?? 0}  
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p>No distractions added yet. Go to Distractions page to add items!</p>
            </div>
          )}
        </div>
      );
    }
    
    return (
      <div className="text-center py-8">
        <p>Content for {title} will be added soon!</p>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ pointerEvents: 'auto' }}
        >
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"
            onClick={onClose}
            style={{ pointerEvents: 'auto' }}
          />
          
          {/* Popup content */}
          <motion.div
            className="relative bg-gray-900 border-2 border-purple-500 rounded-lg w-11/12 max-w-2xl max-h-[80vh] overflow-auto"
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: 'auto' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-purple-500">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6 text-white">
              {renderPopupContent()}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Popup; 