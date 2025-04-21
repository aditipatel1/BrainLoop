"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

interface TaskItemProps {
  title: string;
  description?: string;
  deadline?: string;
  estimatedHours?: number;
  rating?: number;
  isCompleted?: boolean;
  onComplete?: (taskTitle: string) => void; // Modified to pass task title
}

const TaskItem: React.FC<TaskItemProps> = ({
  title,
  isCompleted = false,
  onComplete
}) => {
  const [isCompleting, setIsCompleting] = useState(false);
  
  const handleComplete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent hover events
    
    if (isCompleted) return; // Don't allow re-completing tasks
    
    // Show animation
    setIsCompleting(true);
    
    // Add a small delay before calling the completion handler
    setTimeout(() => {
      if (onComplete) {
        onComplete(title); // Call the onComplete callback with task title
      }
      
      // Reset the state after completion
      setIsCompleting(false);
    }, 600);
  };

  return (
    <motion.div
      className={`relative bg-gray-800 border ${isCompleted ? 'border-green-500/30' : 'border-purple-500/30'} rounded-lg px-4 py-3`}
      whileHover={{ 
        scale: 1.02,
        backgroundColor: 'rgba(50, 50, 80, 0.6)'
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className={`${isCompleted ? 'text-green-400' : 'text-white'} font-semibold truncate max-w-[60%]`}>
          {title}
        </h3>
        
        <motion.button
          className={`${isCompleting ? 'bg-green-500' : 
            isCompleted ? 'bg-emerald-700' : 'bg-green-600'} 
            hover:${isCompleted ? 'bg-emerald-600' : 'bg-green-500'} 
            text-white text-xs rounded-md px-3 py-1 flex items-center`}
          whileHover={{ scale: isCompleted ? 1 : 1.05 }}
          whileTap={{ scale: isCompleted ? 1 : 0.95 }}
          onClick={handleComplete}
          disabled={isCompleting || isCompleted}
          initial={false}
          animate={isCompleting ? {
            scale: [1, 1.2, 1],
            backgroundColor: ['rgb(22, 163, 74)', 'rgb(34, 197, 94)', 'rgb(22, 163, 74)'],
            transition: { duration: 0.6 }
          } : {}}
        >
          <AnimatePresence mode="wait">
            {isCompleting ? (
              <motion.div
                key="completing"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center"
              >
                <FaCheckCircle className="mr-1" />
                Done!
              </motion.div>
            ) : (
              <motion.div
                key="incomplete"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="flex items-center"
              >
                <FaCheckCircle className="mr-1" />
                {isCompleted ? 'Completed' : ''}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TaskItem; 