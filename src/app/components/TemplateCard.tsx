"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimes, FaClock, FaStar } from 'react-icons/fa';
import { IconType } from 'react-icons';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string;
  icon: IconType;
  isSelected: boolean;
  rating?: number;
  estimatedHours?: number;
  onClick: () => void;
  onDeselect?: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  title,
  description,
  icon: Icon,
  isSelected,
  rating,
  estimatedHours,
  onClick,
  onDeselect,
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleDeselect = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDeselect) {
      onDeselect();
    }
  };

  // Generate star rating display
  const renderRating = () => {
    if (rating === undefined) return null;
    return (
      <div className="flex items-center mt-1">
        {Array.from({ length: 3 }).map((_, index) => (
          <FaStar
            key={index}
            size={14}
            className={index < (rating || 0) ? "text-yellow-400" : "text-gray-600"}
          />
        ))}
      </div>
    );
  };

  return (
    <motion.div
      className={`template-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.2)"
      }}
      style={{
        backgroundSize: '400% 400%',
        backgroundPosition: `${(mousePosition.x / 150) * 100}% ${(mousePosition.y / 150) * 100}%`,
        backgroundImage: isSelected 
          ? 'radial-gradient(circle at var(--x) var(--y), rgba(121, 40, 202, 0.15), rgba(20, 20, 40, 0.2))'
          : 'radial-gradient(circle at var(--x) var(--y), rgba(0, 112, 243, 0.1), rgba(20, 20, 40, 0.1))',
        '--x': `${mousePosition.x}px`,
        '--y': `${mousePosition.y}px`,
      } as React.CSSProperties}
    >
      {isSelected && onDeselect && (
        <motion.div 
          className="close-btn"
          onClick={handleDeselect}
          whileHover={{  }}
          whileTap={{ scale: 0.9 }}
        >
          <FaTimes size={14} className="text-white" />
        </motion.div>
      )}
      
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <motion.div 
            className="icon"
            whileHover={{ rotate: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Icon size={24} className="text-blue-400" />
          </motion.div>
        </div>
        <p className="text-gray-300 text-sm">{description}</p>
        
        <div className="mt-auto pt-3 flex justify-between items-center">
          {renderRating()}
          
          {estimatedHours !== undefined && (
            <div className="flex items-center text-sm text-gray-300">
              <FaClock className="mr-1 text-blue-400" size={14} />
              <span>{estimatedHours}h</span>
            </div>
          )}
        </div>
        
        {isSelected && (
          <motion.div 
            className="absolute bottom-4 right-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default TemplateCard; 