"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaUserAlt, FaCog, FaTrophy, FaChartBar, 
  FaGamepad, FaTasks, FaBell, FaCalendarAlt,
  FaPlus, FaTimes, FaUser, FaUsers
} from 'react-icons/fa';
import Image from 'next/image';
import EnhancedIcon from './EnhancedIcon';
import { useAppContext } from '../context/AppContext';
import './modern-dashboard.css';
import GameScreen from '@/components/GameScreen';
const ModernDashboard: React.FC = () => {
  const [activeButton, setActiveButton] = useState('dashboard');
  const [showStatsModal, setShowStatsModal] = useState(false);
  const appContext = useAppContext();
  
  // Initialize with zero values
  const level = 1;
  const currentXp = 0;
  const maxXp = 100;
  const xpPercent = (currentXp / maxXp) * 100;
  
  // Mock data
  const tasks = [];
  const distractions = [];
  
  const sidebarButtons = [
    { id: 'dashboard', icon: FaGamepad, label: 'Dashboard', color: 'purple' },
    { id: 'tasks', icon: FaTasks, label: 'Tasks', color: 'blue' },
    { id: 'friends', icon: FaUsers, label: 'Friends', color: 'green' },
    { id: 'calendar', icon: FaCalendarAlt, label: 'Calendar', color: 'orange' },
  ];
  
  const rightSidebarButtons = [
    { id: 'stats', icon: FaChartBar, label: 'Stats', color: 'purple' },
    { id: 'achievements', icon: FaTrophy, label: 'Achievements', color: 'green' },
    { id: 'alerts', icon: FaBell, label: 'Alerts', color: 'orange' },
  ];
  
  // Particle effect for background
  const ParticleEffect = () => {
    const particles = Array.from({ length: 30 });
    
    return (
      <div className="particles">
        {particles.map((_, index) => {
          const size = Math.random() * 3 + 1;
          const duration = Math.random() * 20 + 10;
          const initialX = Math.random() * 100;
          const initialY = Math.random() * 100;
          const delay = Math.random() * 10;
          
          return (
            <motion.div
              key={index}
              style={{
                position: 'absolute',
                width: size + 'px',
                height: size + 'px',
                borderRadius: '50%',
                background: `rgba(${Math.random() * 100 + 155}, ${Math.random() * 100 + 155}, 255, ${Math.random() * 0.3 + 0.2})`,
                left: initialX + '%',
                top: initialY + '%',
              }}
              animate={{
                y: [0, -100, 0],
                x: [0, Math.random() * 50 - 25, 0],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: 'easeInOut'
              }}
            />
          );
        })}
      </div>
    );
  };
  
  // Profile and XP components
  const ProfileXp = () => {
    return (
      <div className="profile-section">
        <motion.div 
          className="profile-avatar"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <EnhancedIcon 
            Icon={FaUser} 
            size="md" 
            color="white" 
            background="purple" 
            effect="glow" 
          />
          <div className="level-indicator">{level}</div>
        </motion.div>
        
        <div className="xp-progress">
          <div className="xp-bar">
            <motion.div 
              className="xp-fill"
              initial={{ width: 0 }}
              animate={{ width: `${xpPercent}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              <motion.div 
                className="xp-glow"
                animate={{
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "mirror"
                }}
              />
            </motion.div>
          </div>
          <div className="xp-text">
            <span>Level {level}</span>
            <span>{currentXp}/{maxXp} XP</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Settings and action buttons
  const ActionButtons = () => {
    return (
      <div className="actions-container">
        <motion.button 
          className="action-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStatsModal(true)}
        >
          <EnhancedIcon 
            Icon={FaChartBar} 
            size="sm" 
            color="blue" 
            effect="pulse" 
          />
        </motion.button>
        <motion.button 
          className="settings-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <EnhancedIcon 
            Icon={FaCog} 
            size="sm" 
            color="green" 
            effect="rotate" 
          />
        </motion.button>
      </div>
    );
  };
  
  // Character display
  const CharacterDisplay = () => {
    return (
      <motion.div 
        className="character-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div
          className="character-placeholder float"
          animate={{
            y: [0, -20, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <motion.div className="character-icon pulse">
            <EnhancedIcon 
              Icon={FaGamepad} 
              size="lg" 
              color="purple" 
              background="purple" 
              effect="pulse" 
            />
          </motion.div>
          <GameScreen />
        </motion.div>
      </motion.div>
    );
  };
  
  // Sidebar buttons
  const LeftSidebar = () => {
    return (
      <div className="left-sidebar">
        {sidebarButtons.map((button) => (
          <motion.button
            key={button.id}
            className={`sidebar-button ${activeButton === button.id ? 'active' : ''}`}
            onClick={() => setActiveButton(button.id)}
            whileHover={{ x: 10 }}
            whileTap={{ scale: 0.95 }}
          >
            <EnhancedIcon 
              Icon={button.icon} 
              size="sm" 
              color={button.color} 
              effect={activeButton === button.id ? 'glow' : 'none'} 
            />
          </motion.button>
        ))}
      </div>
    );
  };
  
  const RightSidebar = () => {
    return (
      <div className="right-sidebar">
        {rightSidebarButtons.map((button) => (
          <motion.button
            key={button.id}
            className={`sidebar-button ${activeButton === button.id ? 'active' : ''}`}
            onClick={() => {
              setActiveButton(button.id);
              if (button.id === 'stats') {
                setShowStatsModal(true);
              }
            }}
            whileHover={{ x: -10 }}
            whileTap={{ scale: 0.95 }}
          >
            <EnhancedIcon 
              Icon={button.icon} 
              size="sm" 
              color={button.color} 
              effect={activeButton === button.id ? 'glow' : 'none'} 
            />
          </motion.button>
        ))}
      </div>
    );
  };
  
  // Bottom task bar
  const BottomTaskBar = () => {
    const hasTasks = tasks.length > 0;
    const hasDistractions = distractions.length > 0;
    
    return (
      <motion.div 
        className="bottom-task-bar"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <motion.button 
          className="task-button"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="icon">
            <EnhancedIcon 
              Icon={FaTasks} 
              size="sm" 
              color="purple" 
              effect="float" 
            />
          </span>
          <span>Tasks ({hasTasks ? tasks.length : 0})</span>
        </motion.button>
        
        <motion.button 
          className="task-button"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="icon">
            <EnhancedIcon 
              Icon={FaBell} 
              size="sm" 
              color="orange" 
              effect="float" 
            />
          </span>
          <span>Distractions ({hasDistractions ? distractions.length : 0})</span>
        </motion.button>
        
        <motion.button 
          className="task-button"
          whileHover={{ y: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="icon">
            <EnhancedIcon 
              Icon={FaPlus} 
              size="sm" 
              color="green" 
              effect="float" 
            />
          </span>
          <span>Add New</span>
        </motion.button>
      </motion.div>
    );
  };
  
  // Stats modal
  const StatsModal = () => {
    return (
      <AnimatePresence>
        {showStatsModal && (
          <motion.div
            className="stats-modal visible"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="modal-header">
              <h2 className="modal-title">Your Stats</h2>
              <button 
                className="close-button"
                onClick={() => setShowStatsModal(false)}
              >
                <EnhancedIcon 
                  Icon={FaTimes} 
                  size="sm" 
                  color="red" 
                  isAnimated={true} 
                />
              </button>
            </div>
            
            <div className="modal-content">
              <p>No stats available yet. Start completing tasks to see your progress!</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };
  
  return (
    <div className="modern-dashboard-container">
      {/* Background effects */}
      <ParticleEffect />
      
      {/* Content */}
      <div className="dashboard-content">
        {/* Top navigation */}
        <div className="top-nav">
          <ProfileXp />
          <ActionButtons />
        </div>
        
        {/* Main game area */}
        <div className="game-area">
          <CharacterDisplay />
        </div>
        
        {/* Floating sidebars */}
        <LeftSidebar />
        <RightSidebar />
        
        {/* Bottom task bar */}
        <BottomTaskBar />
        
        {/* Stats modal */}
        <StatsModal />
      </div>
    </div>
  );
};

export default ModernDashboard; 