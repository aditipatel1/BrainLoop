"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { FaCog, FaUser } from 'react-icons/fa';
import SpaceBackground from '../components/SpaceBackground';
import styles from './dashboard.module.css';
import GameScreen from '@/components/GameScreen';
import AlternateGameScreen, { AlternateGameScreenMethods } from '@/components/AlternateGameScreen';
import EnhancedIcon from '../components/EnhancedIcon';
import { LeftSidebar } from '../components/DashboardComponents';
import RightSidebar from '../components/RightSidebar';
import Popup from '../components/Popup';
import { useAppContext } from '../context/AppContext';
import { taskTemplates } from '@/Goals';
import { distractionTemplates } from '@/Distractions';
import { v4 as uuidv4 } from 'uuid';
import { Players } from '@/Players';

export default function Dashboard() {
  // Mock user data
  const [userData, setUserData] = useState({
    username: 'Cosmic Explorer',
    level: 5,
    nextLevel: 6,
    currentXP: 350,
    targetXP: 500,
    streak: 7,
    profileImage: null // Will use a placeholder icon if null
  });

  // State for active sidebar section
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // State for popups
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  
  // State for tracking completed steps (0-8)
  const [completedSteps, setCompletedSteps] = useState(0);
  
  // Ref to access AlternateGameScreen methods
  const gameScreenRef = useRef<AlternateGameScreenMethods>(null);

  // Access app context
  const { addItem, goals, distractions } = useAppContext();

  // Add sample data when component mounts
  useEffect(() => {
    // Only add sample data if none exists
    if (goals.length === 0) {
      // Add all tasks from taskTemplates
      taskTemplates.forEach(task => {
        addItem({
          id: uuidv4(),
          type: 'goal',
          name: task.title,
          description: task.description,
          deadline: task.deadline,
          estimatedHours: task.estimatedHours,
          rating: task.rating,
          isCompleted: false
        });
      });
    }

    if (distractions.length === 0) {
      // Add 3 sample distractions
      distractionTemplates.slice(0, 3).forEach(distraction => {
        addItem({
          id: uuidv4(),
          type: 'distraction',
          name: distraction.title,
          description: distraction.description,
          timeLimit: distraction.timeLimit,
          isCompleted: false
        });
      });
    }
  }, [addItem, goals.length, distractions.length]);

  // Handle progress increment when move button is clicked
  const handleProgressIncrement = () => {
    // Increment completed steps by 1, but don't exceed 8
    setCompletedSteps(prev => Math.min(prev + 1, 8));
  };
  
  // Handle task completion
  const handleTaskComplete = () => {
    console.log("Task completed, triggering character movement");
    
    // Call the handleMove function on the game screen component
    if (gameScreenRef.current) {
      gameScreenRef.current.handleMove();
    }
  };

  // Calculate XP percentage
  const xpPercentage = Math.min(100, Math.floor((userData.currentXP / userData.targetXP) * 100));

  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    console.log(`Changed to section: ${section}`);
  };
  
  // Handle showing popup
  const handleShowPopup = (section: string) => {
    setPopupTitle(section.charAt(0).toUpperCase() + section.slice(1)); // Capitalize first letter
    setPopupOpen(true);
    console.log('Opening popup for:', section);
  };
  
  // Handle closing popup
  const handleClosePopup = () => {
    setPopupOpen(false);
    setLeaderboardOpen(false);
    console.log('Closing popup');
  };
  
  // Handle leaderboard button click
  const handleLeaderboardClick = () => {
    setPopupTitle('Leaderboard');
    setLeaderboardOpen(true);
    console.log('Opening leaderboard');
  };

  // Custom layout style
  const mainContentStyle = {
    marginLeft: '320px',    // Space for left sidebar
    marginRight: '240px',   // Reduced space for right sidebar (from 260px)
    marginTop: '40px',      // Push content down a bit
    paddingTop: '40px',     // Additional space at the top
    width: 'calc(100% - 560px)', // Subtract both margins (adjusted for narrower right sidebar)
    maxWidth: '1200px',     // Prevent excessive width on large screens
    margin: '140px auto 0',  // Center horizontally with space at top
    position: 'relative' as const,
    zIndex: 5
  };

  // Add shimmer animation for XP bar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
      .animate-shimmer {
        animation: shimmer 2s infinite;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="dashboard-wrapper" style={{ width: '100%', height: '100vh', position: 'relative', overflow: 'scroll' }}>
      <SpaceBackground />
      
      {/* Top navbar */}
      <header className={styles.topNavbar}>
        <div className={styles.navbarContent}>
          {/* Left side - Logo and title */}
          <div className="flex items-center">
            <h1 
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-500 to-indigo-400 text-3xl md:text-4xl font-extrabold tracking-wider"
              style={{ 
                fontFamily: "'Press Start 2P', cursive",
                textShadow: '0 0 30px rgba(168, 85, 247, 0.5)'
              }}
            >
              DOABLE.AI
            </h1>
            <div className="h-8 w-[1px] mx-4 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent"></div>
            <p className="text-white text-sm font-light tracking-widest uppercase">
              Productivity Companion
            </p>
          </div>

          {/* Right side - XP and Level */}
          <div className="flex items-center gap-4">
            {/* Integrated XP bar in header */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col" style={{ width: "240px" }}>
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" className="mr-1 text-purple-300" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                    <span className="text-white text-xs font-bold">LVL {userData.level}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-white text-xs font-bold">LVL {userData.nextLevel}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" className="ml-1 text-purple-300" fill="currentColor">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                    </svg>
                  </div>
                </div>
                <div className="relative w-full h-3 bg-gray-900 rounded-full overflow-hidden border border-purple-500/30">
                  <div 
                    className="absolute h-full bg-gradient-to-r from-violet-600 to-pink-500"
                    style={{ width: `${xpPercentage}%`, 
                      boxShadow: '0 0 8px rgba(139, 92, 246, 0.5)',
                      transition: 'width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-gray-300 text-xs">{userData.currentXP} XP</span>
                  <span className="text-gray-300 text-xs">{userData.targetXP} XP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content layout with three columns */}
      <div className="dashboard-layout" style={{ display: 'flex', height: 'calc(100vh - 100px)', marginTop: '100px' }}>
        {/* Left Sidebar Column - Fixed width */}
        <div className="sidebar-column" style={{ width: '300px', paddingLeft: '30px', paddingRight: '10px', marginTop: '100px', flexShrink: 0 }}>
          <LeftSidebar 
            streakCount={userData.streak}
            activeSection={activeSection}
            onSectionChange={handleSectionChange}
            onShowPopup={handleShowPopup}
            onTaskComplete={handleTaskComplete}
          />
        </div>
        
        {/* Center Game Content - Flexible width with increased height and better visibility */}
        <div className="game-column" style={{ 
          flex: 1, 
          paddingTop: '10px', 
          position: 'relative', 
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Game Screen Container */}
          <div style={{ 
            width: '100%', 
            maxWidth: '1000px', 
            margin: '0 auto', 
            flex: 1,
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Display the alternate game screen with adequate height */}
            <div style={{ flex: 1, minHeight: '550px' }}>
              <AlternateGameScreen 
                ref={gameScreenRef}
                onProgress={handleProgressIncrement} 
                goals={goals}
              />
            </div>
          </div>
        </div>
        
        {/* Right Sidebar Column - Fixed width */}
        <div className="sidebar-column" style={{ width: '300px', paddingLeft: '10px', paddingRight: '30px', marginTop: '100px', flexShrink: 0 }}>
          <RightSidebar onLeaderboardClick={handleLeaderboardClick} completedSteps={completedSteps} />
        </div>
      </div>
      
      {/* Primary popup */}
      {popupOpen && (
        <Popup
          isOpen={popupOpen}
          onClose={handleClosePopup}
          title={popupTitle}
        />
      )}
      
      {/* Leaderboard popup */}
      {leaderboardOpen && (
        <Popup
          isOpen={leaderboardOpen}
          onClose={handleClosePopup}
          title="Leaderboard"
        >
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-purple-500/30">
              <h3 className="text-2xl font-bold text-white">Global Rankings</h3>
              <div className="text-purple-300 text-sm">Last updated: Today</div>
            </div>
            
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center bg-purple-900/20 p-4 rounded-lg">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${
                    i === 0 ? 'bg-yellow-400 text-yellow-900' : 
                    i === 1 ? 'bg-gray-300 text-gray-800' : 
                    i === 2 ? 'bg-amber-600 text-amber-100' : 
                    'bg-purple-500/30 text-white'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-700 mr-4"
                    style={{ backgroundImage: `url(https://i.pravatar.cc/100?img=${i+10})`, backgroundSize: 'cover' }}
                  ></div>
                  <div className="flex-1">
                    <div className="text-white font-semibold">{Players[i].name}</div>
                    <div className="text-gray-400 text-xs">Level {Players[i].level}</div>
                  </div>
                  <div className="text-xl font-bold text-purple-300">{Players[i].xp}</div>
                </div>
              ))}
            </div>
          </div>
        </Popup>
      )}
    </div>
  );
} 