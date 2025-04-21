"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface PixelRobotProps {
  isMoving: boolean;
  direction: 'up' | 'down';
  color?: string;
}

const PixelRobot: React.FC<PixelRobotProps> = ({ isMoving, direction, color = '#4cc9f0' }) => {
  return (
    <motion.div
      className="pixel-robot-container"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", damping: 10, stiffness: 300 }}
    >
      <div className="pixel-robot-body">
        {/* Head */}
        <div className="pixel-part head" style={{ backgroundColor: color }} />
        
        {/* Eyes */}
        <div className="pixel-part eye left-eye" />
        <div className="pixel-part eye right-eye" />
        
        {/* Antenna */}
        <div className="pixel-part antenna" />
        <div className="pixel-part antenna-dot" style={{ backgroundColor: isMoving ? '#ff6b6b' : '#4cc9f0' }} />
        
        {/* Body */}
        <div className="pixel-part body" style={{ backgroundColor: color }} />
        
        {/* Arms */}
        <motion.div 
          className="pixel-part arm left-arm" 
          animate={{ 
            rotate: isMoving ? [0, -20, 0] : 0 
          }}
          transition={{ 
            repeat: isMoving ? Infinity : 0, 
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="pixel-part arm right-arm" 
          animate={{ 
            rotate: isMoving ? [0, 20, 0] : 0 
          }}
          transition={{ 
            repeat: isMoving ? Infinity : 0, 
            duration: 0.5,
            ease: "easeInOut"
          }}
        />
        
        {/* Legs */}
        <motion.div 
          className="pixel-part leg left-leg" 
          animate={{ 
            y: isMoving ? [0, -5, 0] : 0 
          }}
          transition={{ 
            repeat: isMoving ? Infinity : 0, 
            duration: 0.3,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="pixel-part leg right-leg" 
          animate={{ 
            y: isMoving ? [0, 5, 0] : 0 
          }}
          transition={{ 
            repeat: isMoving ? Infinity : 0, 
            duration: 0.3,
            ease: "easeInOut",
            delay: 0.15
          }}
        />
        
        {/* Direction indicator */}
        <motion.div 
          className={`direction-indicator ${direction}`}
          animate={{ 
            opacity: isMoving ? [0.2, 1, 0.2] : 0
          }}
          transition={{ 
            repeat: isMoving ? Infinity : 0, 
            duration: 0.5
          }}
        />
      </div>
      
      {/* Shadow */}
      <motion.div 
        className="pixel-robot-shadow"
        animate={{ 
          scaleX: isMoving ? [1, 0.8, 1] : 1,
          opacity: isMoving ? [0.3, 0.2, 0.3] : 0.3
        }}
        transition={{ 
          repeat: isMoving ? Infinity : 0, 
          duration: 0.3
        }}
      />
    </motion.div>
  );
};

export default PixelRobot; 