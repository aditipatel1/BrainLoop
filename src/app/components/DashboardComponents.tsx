"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaFire, FaUsers, FaTasks, FaBan, FaClock, FaAngleDown } from 'react-icons/fa';
import EnhancedIcon from './EnhancedIcon';
import styles from './DashboardComponents.module.css';
import { useAppContext } from '../context/AppContext';
import TaskItem from './TaskItem';

interface StreakCounterProps {
  streakCount: number;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({ streakCount }) => {
  // Calculate fire size based on streak
  const getFireSize = () => {
    if (streakCount < 3) return 'sm';
    if (streakCount < 7) return 'md';
    if (streakCount < 14) return 'lg';
    return 'xl';
  };

  // Calculate fire color intensity based on streak
  const getFireColor = () => {
    if (streakCount < 3) return '#FF7043';
    if (streakCount < 7) return '#FF5722';
    if (streakCount < 14) return '#FF3D00';
    return '#DD2C00';
  };

  return (
    <motion.div 
      className={styles.streakContainer}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className={styles.streakContent}>
        <div className={styles.streakIconContainer}>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          >
            <EnhancedIcon 
              Icon={FaFire} 
              size={getFireSize()} 
              color={getFireColor()}
              effect="pulse"
              iconSize={streakCount > 10 ? 40 : streakCount > 5 ? 32 : 24}
            />
          </motion.div>
        </div>
        <div className={styles.streakInfo}>
          <h3 className={styles.streakTitle}>Current Streak</h3>
          <div className={styles.streakCount}>{streakCount} days</div>
        </div>
      </div>
      <div className={styles.streakGlow} style={{ opacity: Math.min(0.2 + streakCount * 0.05, 0.8) }}></div>
    </motion.div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
  isActive?: boolean;
}

export const NavButton: React.FC<NavButtonProps> = ({ 
  icon, 
  label, 
  onClick, 
  color, 
  isActive = false 
}) => {
  return (
    <motion.button
      className={`${styles.navButton} ${isActive ? styles.activeButton : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      whileHover={{ x: 5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 15,
      }}
      style={{ cursor: 'pointer', zIndex: 30 }}
    >
      <div className={styles.navIconContainer} style={{ backgroundColor: `${color}33` }}>
        {icon}
      </div>
      <span className={styles.navLabel}>{label}</span>
      {isActive && <div className={styles.activeIndicator} style={{ backgroundColor: color }}></div>}
    </motion.button>
  );
};

interface NavDropdownButtonProps {
  icon: React.ReactNode;
  label: string;
  color: string;
  isActive?: boolean;
  type: 'tasks' | 'distractions';
}

export const NavDropdownButton: React.FC<NavDropdownButtonProps> = ({ 
  icon, 
  label, 
  color, 
  isActive = false,
  type
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { goals, distractions } = useAppContext();
  
  // Limit number of visible tasks at once for better UI
  const visibleGoals = goals;
  
  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setIsOpen(false);
    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer}>
      <motion.button
        className={`${styles.navButton} ${isActive ? styles.activeButton : ''}`}
        onClick={toggleDropdown}
        whileHover={{ x: 5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
        style={{ cursor: 'pointer', zIndex: 30 }}
      >
        <div className={styles.navIconContainer} style={{ backgroundColor: `${color}33` }}>
          {icon}
        </div>
        <span className={styles.navLabel}>{label}</span>
        <FaAngleDown className={`ml-2 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        {isActive && <div className={styles.activeIndicator} style={{ backgroundColor: color }}></div>}
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.dropdownMenu}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            {type === 'tasks' && (
              <div className={styles.dropdownContent}>
                <h3 className={styles.dropdownTitle}>Your Tasks</h3>
                {visibleGoals.length > 0 ? (
                  <div className={styles.tasksList}>
                    {visibleGoals.map((goal) => (
                      <div key={goal.id} className={styles.dropdownItem}>
                        <TaskItem
                          title={goal.name}
                          description={goal.description || ''}
                          deadline={goal.deadline || ''}
                          estimatedHours={goal.estimatedHours || 0}
                          rating={goal.rating || 0}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No tasks added yet</div>
                )}
              </div>
            )}
            
            {type === 'distractions' && (
              <div className={styles.dropdownContent}>
                <h3 className={styles.dropdownTitle}>Your Distractions</h3>
                {distractions.length > 0 ? (
                  <div className={styles.distractionsList}>
                    {distractions.map((distraction) => (
                      <motion.div 
                        key={distraction.id} 
                        className={styles.dropdownItem}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className={styles.distractionItem}>
                          <h3 className={styles.distractionTitle}>{distraction.name}</h3>
                          <p className={styles.distractionDesc}>{distraction.description || ''}</p>
                          {distraction.timeLimit && (
                            <p className={styles.distractionTime}>
                              <FaClock className="mr-2" size={12} />
                              Time Limit: {distraction.timeLimit} hours
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No distractions added yet</div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ScreenTimeProps {
  hours: number;
  minutes: number;
}

export const ScreenTime: React.FC<ScreenTimeProps> = ({ 
  hours = 2, 
  minutes = 34
}) => {
  // Format time with leading zeros
  const formatTime = (value: number): string => {
    return value.toString().padStart(2, '0');
  };

  return (
    <motion.div 
      className={styles.screenTimeContainer}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className={styles.screenTimeIcon}>
        <EnhancedIcon Icon={FaClock} size="sm" color="#64B5F6" effect="glow" />
      </div>
      <div className={styles.screenTimeContent}>
        <div className={styles.screenTimeLabel}>Screen Time</div>
        <div className={styles.screenTimeValue}>
          {formatTime(hours)}:{formatTime(minutes)} hrs
        </div>
      </div>
    </motion.div>
  );
};

// Separate static Tasks component that's always open
export const TasksSection: React.FC<{isActive: boolean, onClick: () => void, onTaskComplete?: () => void}> = ({ isActive, onClick, onTaskComplete }) => {
  const { goals, updateItem } = useAppContext();
  
  // Handle task completion
  const handleTaskComplete = (taskTitle: string) => {
    // Find the task by title and mark it as completed
    const taskToComplete = goals.find(goal => goal.name === taskTitle);
    if (taskToComplete) {
      updateItem(taskToComplete.id, { isCompleted: true });
    }
    
    // Call the onTaskComplete function which should trigger character movement
    if (onTaskComplete) {
      onTaskComplete();
    }
  };
  
  // Sort goals: incomplete tasks first, then completed tasks
  const sortedGoals = [...goals].sort((a, b) => {
    if (a.isCompleted === b.isCompleted) return 0;
    return a.isCompleted ? 1 : -1;
  });
  
  return (
    <div className={styles.staticSection}>
      <motion.div 
        className={`${styles.navButton} ${isActive ? styles.activeButton : ''} ${styles.tasksHeader}`}
        onClick={onClick}
        whileHover={{ x: 5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 15,
        }}
      >
        <div className={styles.navIconContainer} style={{ backgroundColor: '#4CAF5033' }}>
          <EnhancedIcon Icon={FaTasks} size="sm" color="#4CAF50" />
        </div>
        <span className={styles.navLabel}>Tasks</span>
        {isActive && <div className={styles.activeIndicator} style={{ backgroundColor: '#4CAF50' }}></div>}
      </motion.div>
      
      <motion.div 
        className={styles.staticContent}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h3 className={styles.dropdownTitle}>Your Tasks</h3>
        {sortedGoals.length > 0 ? (
          <div className={styles.tasksList}>
            {sortedGoals.map((goal) => (
              <motion.div 
                key={goal.id} 
                className={styles.dropdownItem}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                <TaskItem
                  title={goal.name}
                  isCompleted={goal.isCompleted || false}
                  onComplete={handleTaskComplete}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>No tasks added yet</div>
        )}
      </motion.div>
    </div>
  );
};

// Component that combines all left sidebar elements
interface LeftSidebarProps {
  streakCount: number;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onShowPopup: (section: string) => void;
  onTaskComplete?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  streakCount,
  activeSection,
  onSectionChange,
  onShowPopup,
  onTaskComplete
}) => {
  const handleButtonClick = (section: string) => {
    console.log("Button clicked for section:", section);
    onSectionChange(section);
  };

  return (
    <div className={styles.leftSidebar} style={{ position: 'relative', height: '100%' }}>
      <div className={styles.sidebarTop}>
        <div className={styles.navButtons} style={{ 
          marginBottom: '12px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px',
          paddingBottom: '80px'
        }}>
          {/* Always visible tasks section */}
          <TasksSection 
            isActive={activeSection === 'tasks'} 
            onClick={() => handleButtonClick('tasks')}
            onTaskComplete={onTaskComplete}
          />
          
          {/* Regular dropdown for distractions */}
          <NavDropdownButton 
            icon={<EnhancedIcon Icon={FaBan} size="sm" color="#F44336" />} 
            label="Distractions"
            color="#F44336"
            isActive={activeSection === 'distractions'}
            type="distractions"
          />
        </div>
      </div>
    </div>
  );
}; 