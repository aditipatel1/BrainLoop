"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ItemType = 'goal' | 'distraction' | 'task';

export interface Item {
  id: string;
  type: ItemType;
  name: string;
  template?: string;
  description?: string;
  deadline?: string;
  estimatedHours?: number;
  rating?: number;
  timeLimit?: number;
  isCompleted?: boolean;
  isSelected?: boolean;
}

interface AppContextType {
  currentPage: number;
  goals: Item[];
  distractions: Item[];
  tasks: Item[];
  setCurrentPage: (page: number) => void;
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [goals, setGoals] = useState<Item[]>([]);
  const [distractions, setDistractions] = useState<Item[]>([]);
  const [tasks, setTasks] = useState<Item[]>([]);

  const addItem = (item: Item) => {
    if (item.type === 'goal') {
      if (item.template) {
        setGoals(prev => [...prev.filter(g => g.template !== item.template), item]);
      } else {
        setGoals(prev => [...prev, item]);
      }
    } else if (item.type === 'distraction') {
      if (item.template) {
        setDistractions(prev => [...prev.filter(d => d.template !== item.template), item]);
      } else {
        setDistractions(prev => [...prev, item]);
      }
    } else if (item.type === 'task') {
      setTasks(prev => [...prev, item]);
    }
  };

  const removeItem = (id: string) => {
    setGoals(prev => prev.filter(goal => goal.id !== id));
    setDistractions(prev => prev.filter(distraction => distraction.id !== id));
    setTasks(prev => prev.filter(task => task.id !== id));
  };
  
  const updateItem = (id: string, updates: Partial<Item>) => {
    setGoals(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setDistractions(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
    setTasks(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        goals,
        distractions,
        tasks,
        setCurrentPage,
        addItem,
        removeItem,
        updateItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}; 