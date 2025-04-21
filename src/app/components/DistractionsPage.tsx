"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaMobileAlt, 
  FaGamepad, 
  FaTv, 
  FaUtensils, 
  FaBed, 
  FaUsers 
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import TemplateCard from './TemplateCard';
import { useAppContext, Item } from '../context/AppContext';
import { distractionTemplates } from '@/Distractions';
const DistractionsPage: React.FC = () => {
  const { distractions, addItem, removeItem, setCurrentPage } = useAppContext();

  const handleSelectDistraction = (template: typeof distractionTemplates[0]) => {
    const existingDistraction = distractions.find(d => d.template === template.id);
    
    if (existingDistraction) {
      removeItem(existingDistraction.id);
    } else {
      const distraction: Item = {
        id: uuidv4(),
        type: 'distraction',
        name: template.title,
        template: template.id,
      };
      
      addItem(distraction);
    }
  };
  
  const handleDeselectDistraction = (templateId: string) => {
    const distraction = distractions.find(d => d.template === templateId);
    if (distraction) {
      removeItem(distraction.id);
    }
  };

  const handleNext = () => {
    setCurrentPage(2);
  };

  const handleBack = () => {
    setCurrentPage(0);
  };

  return (
    <motion.div 
      className="page-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="max-w-4xl mx-auto px-4 py-8 h-full flex flex-col">
        <motion.div 
          className="mb-8 text-center"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="pixel-title">Identify Distractions</h1>
          <p className="pixel-subtitle">Select what typically distracts you</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow">
          {distractionTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <TemplateCard
                id={template.id}
                title={template.title}
                description={template.description}
                icon={template.icon}
                isSelected={distractions.some(d => d.template === template.id)}
                onClick={() => handleSelectDistraction(template)}
                onDeselect={() => handleDeselectDistraction(template.id)}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-8 flex justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button 
            className="px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
            onClick={handleBack}
          >
            Back
          </button>
          
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={distractions.length === 0}
          >
            View Summary
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DistractionsPage; 