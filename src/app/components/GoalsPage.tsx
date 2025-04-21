"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaBook, 
  FaBriefcase, 
  FaCode, 
  FaEnvelope, 
  FaFile, 
  FaGraduationCap, 
  FaLaptopCode, 
  FaRegFileAlt, 
  FaChalkboardTeacher,
  FaFileAlt,
  FaCalendarAlt,
  FaClock,
  FaPlus,
  FaEdit
} from 'react-icons/fa';
import { v4 as uuidv4 } from 'uuid';
import { useAppContext, Item } from '../context/AppContext';
import TemplateCard from './TemplateCard';
import { taskTemplates, addCustomTask, updateTask, TaskTemplate } from '@/Goals';
import TaskModal, { TaskData } from './TaskModal';

const GoalsPage: React.FC = () => {
  const { goals, addItem, removeItem, setCurrentPage } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState<TaskTemplate | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Combined list of tasks (templates + custom tasks)
  const [localTaskTemplates, setLocalTaskTemplates] = useState<TaskTemplate[]>([...taskTemplates]);

  const handleSelectGoal = (task: TaskTemplate) => {
    const existingGoal = goals.find(goal => goal.template === `task-${task.id}`);
    
    if (existingGoal) {
      removeItem(existingGoal.id);
    } else {
      const goal: Item = {
        id: uuidv4(),
        type: 'goal',
        name: task.title,
        template: `task-${task.id}`,
        description: task.description,
        deadline: task.deadline,
        estimatedHours: task.estimatedHours,
        rating: task.rating,
        isCompleted: false
      };
      
      addItem(goal);
    }
  };
  
  const handleDeselectGoal = (taskId: number) => {
    const goal = goals.find(g => g.template === `task-${taskId}`);
    if (goal) {
      removeItem(goal.id);
    }
  };

  const handleNext = () => {
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    const selectedTemplateIds = goals.map(goal => goal.template);
    
    localTaskTemplates.forEach((task) => {
      const templateId = `task-${task.id}`;
      if (!selectedTemplateIds.includes(templateId)) {
        const goal: Item = {
          id: uuidv4(),
          type: 'goal',
          name: task.title,
          template: templateId,
          description: task.description,
          deadline: task.deadline,
          estimatedHours: task.estimatedHours,
          rating: task.rating,
          isCompleted: false
        };
        
        addItem(goal);
      }
    });
  };

  const openAddTaskModal = () => {
    setIsEditing(false);
    setCurrentTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task: TaskTemplate) => {
    setIsEditing(true);
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: TaskData) => {
    if (isEditing && currentTask) {
      // Update existing task
      const updatedTask = updateTask(currentTask.id, taskData);
      if (updatedTask) {
        // Update local state
        setLocalTaskTemplates(prev => 
          prev.map(task => task.id === updatedTask.id ? updatedTask : task)
        );
        
        // Update any selected goals with this template
        const goal = goals.find(g => g.template === `task-${currentTask.id}`);
        if (goal) {
          removeItem(goal.id);
          const updatedGoal: Item = {
            id: uuidv4(),
            type: 'goal',
            name: updatedTask.title,
            template: `task-${updatedTask.id}`,
            description: updatedTask.description,
            deadline: updatedTask.deadline,
            estimatedHours: updatedTask.estimatedHours,
            rating: updatedTask.rating,
            isCompleted: goal.isCompleted || false
          };
          addItem(updatedGoal);
        }
      }
    } else {
      // Add new task
      const newTask = addCustomTask(taskData);
      setLocalTaskTemplates(prev => [...prev, newTask]);
    }
    
    setIsModalOpen(false);
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
          <h1 className="pixel-title">Select Your Tasks</h1>
          <p className="pixel-subtitle">Choose the tasks you want to focus on</p>
          
          <div className="flex justify-center mt-4 space-x-4">
            <motion.button
              className="select-all-button px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-pixel text-sm shadow-md transition-colors"
              onClick={handleSelectAll}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Select All
            </motion.button>
            
            <motion.button
              className="add-task-button px-4 py-2 bg-indigo-600/90 hover:bg-purple-600/90 rounded-md text-white font-pixel text-sm shadow-lg backdrop-blur-sm transition-all flex items-center"
              onClick={openAddTaskModal}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <FaPlus className="mr-2" /> Add New Task
            </motion.button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 flex-grow overflow-y-auto">
          {localTaskTemplates.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="relative"
            >
              <div className="absolute top-2 right-2 z-10">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditTaskModal(task);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-1 transition-colors"
                >
                  <FaEdit size={14} />
                </button>
              </div>
              <TemplateCard
                id={`task-${task.id}`}
                title={task.title}
                description={task.description}
                icon={task.icon}
                isSelected={goals.some(goal => goal.template === `task-${task.id}`)}
                rating={task.rating}
                estimatedHours={task.estimatedHours}
                onClick={() => handleSelectGoal(task)}
                onDeselect={() => handleDeselectGoal(task.id)}
              />
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          className="mt-8 flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <button 
            className="next-button"
            onClick={handleNext}
            disabled={goals.length === 0}
          >
            Continue to Distractions
          </button>
        </motion.div>
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        initialData={currentTask || undefined}
        isEditing={isEditing}
      />
    </motion.div>
  );
};

export default GoalsPage; 