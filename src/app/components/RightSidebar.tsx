"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaChartPie, FaCrown, FaFire, FaClock } from 'react-icons/fa';
import EnhancedIcon from './EnhancedIcon';
import { ScreenTime, StreakCounter } from './DashboardComponents';

// Create styles for this component
const styles = {
  rightSidebar: `flex flex-col gap-3 relative justify-between max-h-[calc(100vh-140px)]`,
  
  glassPanel: `bg-gradient-to-br from-[rgba(25,8,45,0.9)] to-[rgba(40,12,70,0.85)]
    rounded-xl border border-[rgba(255,255,255,0.15)] backdrop-filter backdrop-blur-sm
    shadow-xl overflow-hidden transition-all duration-300 hover:border-[rgba(255,255,255,0.2)]`,
  
  miniHeader: `px-3 py-2 border-b border-white/5 flex items-center gap-2 bg-black/10`,
  
  leaderboardBtn: `py-2 px-4 flex items-center justify-between
    bg-gradient-to-r from-indigo-900/50 to-purple-900/50
    hover:from-indigo-700/60 hover:to-purple-700/60
    rounded-lg border border-indigo-500/30 transition-all duration-300
    cursor-pointer shadow-md hover:shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20`,
  
  btnText: `text-white text-sm font-bold`,
  
  circleContainer: `p-3 flex flex-col items-center`,
  
  circleChart: `relative w-[130px] h-[130px] mb-1`,
  
  circleInner: `absolute inset-[12px] rounded-full bg-gradient-to-br 
    from-purple-900/90 to-gray-900/90 flex items-center justify-center
    border border-white/5`,
  
  percentText: `text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400
    text-transparent bg-clip-text`,
    
  labelText: `text-gray-300 text-xs`,
};

// Types for our components
interface LeaderboardButtonProps {
  onClick: () => void;
}

interface CircleProgressProps {
  percentage: number;
  label: string;
  completedSteps: number;
}

// CircleProgress component
const CircleProgress: React.FC<CircleProgressProps> = ({ percentage, label, completedSteps }) => {
  // Calculate the circle's circumference and offset
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className={styles.glassPanel}>
      <div className={styles.miniHeader}>
        <FaChartPie size={14} className="text-purple-400" />
        <h3 className="text-white text-xs font-semibold">{label}</h3>
      </div>
      <div className={styles.circleContainer}>
        <motion.div 
          className={styles.circleChart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <svg width="100%" height="100%" viewBox="0 0 130 130">
            {/* Background circle */}
            <circle 
              cx="65" cy="65" r={radius} 
              stroke="rgba(107, 70, 193, 0.2)" 
              strokeWidth="9" 
              fill="none" 
            />
            
            {/* Progress circle with gradient */}
            <motion.circle 
              cx="65" cy="65" r={radius} 
              stroke="url(#gradientStroke)" 
              strokeWidth="9" 
              strokeLinecap="round"
              fill="none" 
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EC4899" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#6366F1" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className={styles.circleInner}>
            <div className="text-center">
              <motion.div 
                className={styles.percentText}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {percentage}%
              </motion.div>
              <div className={styles.labelText} style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.7)' }}>
                {completedSteps} of 8 steps
              </div>
            </div>
          </div>
        </motion.div>

        {/* Step markers - visual dots */}
        <div className="w-full flex justify-between px-6 mb-1">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full ${i < completedSteps ? 'bg-purple-400' : 'bg-gray-700'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Main RightSidebar component
interface RightSidebarProps {
  onLeaderboardClick: () => void;
  completedSteps?: number;
  streakCount?: number;
}

// Calculate daily progress based on completed steps (out of 8 total steps)
const calculateDailyProgress = (completedSteps: number): number => {
  // Ensure the completed steps is within valid range (0-8)
  const validSteps = Math.max(0, Math.min(8, completedSteps));
  // Each step contributes 12.5% to the total progress
  return validSteps * 12.5;
};

const RightSidebar: React.FC<RightSidebarProps> = ({ 
  onLeaderboardClick,
  completedSteps = 6,
  streakCount = 5,
}) => {
  const progressPercentage = calculateDailyProgress(completedSteps);
  
  return (
    <div className={styles.rightSidebar}>
      {/* Daily Progress Circle */}
      <CircleProgress 
        percentage={progressPercentage} 
        label="Daily Progress" 
        completedSteps={completedSteps}
      />
      
      {/* Leaderboard */}
      <div className={styles.glassPanel}>
        <div className={styles.miniHeader}>
          <FaTrophy size={14} className="text-yellow-400" />
          <h3 className="text-white text-xs font-semibold">Leaderboard</h3>
        </div>
        <div className="p-3">
          <motion.button 
            className={styles.leaderboardBtn}
            onClick={onLeaderboardClick}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="flex items-center gap-2">
              <FaTrophy size={16} className="text-yellow-400" />
              <span className={styles.btnText}>View Leaderboard</span>
            </div>
            <motion.div 
              animate={{ x: [0, 4, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <span className="text-indigo-300">→</span>
            </motion.div>
          </motion.button>
        </div>
      </div>
      
      {/* Streak Counter - with compact padding */}
      <div className={styles.glassPanel}>
        <div className={styles.miniHeader}>
          <FaFire size={14} className="text-orange-400" />
          <h3 className="text-white text-xs font-semibold">Activity Streak</h3>
        </div>
        <div className="p-1 -mt-1">
          <StreakCounter streakCount={streakCount} />
        </div>
      </div>
      
      {/* Screen Time - with compact padding */}
      <div className={styles.glassPanel}>
        <div className={styles.miniHeader}>
          <FaClock size={14} className="text-blue-400" />
          <h3 className="text-white text-xs font-semibold">Screen Time</h3>
        </div>
        <div className="p-1 -mt-1">
          <ScreenTime hours={2} minutes={34} />
        </div>
      </div>
    </div>
  );
};

export default RightSidebar; 