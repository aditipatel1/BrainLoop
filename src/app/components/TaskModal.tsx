"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt, FaClock, FaStar } from 'react-icons/fa';
import { IconType } from 'react-icons';
import { 
  FaBook, 
  FaBriefcase, 
  FaCode, 
  FaFileAlt, 
  FaLaptopCode, 
  FaGraduationCap, 
  FaChalkboardTeacher, 
  FaRegFileAlt 
} from 'react-icons/fa';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (taskData: TaskData) => void;
  initialData?: TaskData;
  isEditing?: boolean;
}

export interface TaskData {
  id?: number;
  title: string;
  description: string;
  deadline: string;
  estimatedHours: number;
  rating: number;
  icon: IconType;
}

const availableIcons = [
  { icon: FaBook, name: "Book" },
  { icon: FaFileAlt, name: "Document" },
  { icon: FaCode, name: "Code" },
  { icon: FaBriefcase, name: "Briefcase" },
  { icon: FaLaptopCode, name: "Laptop" },
  { icon: FaGraduationCap, name: "Education" },
  { icon: FaChalkboardTeacher, name: "Presentation" },
  { icon: FaRegFileAlt, name: "Note" },
];

const TaskModal: React.FC<TaskModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData,
  isEditing = false
}) => {
  const [taskData, setTaskData] = useState<TaskData>({
    title: '',
    description: '',
    deadline: new Date().toISOString().split('T')[0] + 'T12:00:00',
    estimatedHours: 1,
    rating: 2,
    icon: FaBook
  });

  useEffect(() => {
    if (initialData) {
      setTaskData({
        ...initialData,
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setTaskData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingChange = (newRating: number) => {
    setTaskData(prev => ({ ...prev, rating: newRating }));
  };

  const handleIconSelect = (icon: IconType) => {
    setTaskData(prev => ({ ...prev, icon }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(taskData);
    onClose();
  };

  // Format current date for min date in deadline picker
  const currentDate = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-gray-800 rounded-xl w-full max-w-md overflow-hidden border border-blue-500/30"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="flex justify-between items-center p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">
                {isEditing ? 'Edit Task' : 'Create New Task'}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4">
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Task title"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-300 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Task description"
                  rows={3}
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="deadline" className="block text-gray-300 mb-1">
                  <FaCalendarAlt className="inline mr-2" /> Deadline
                </label>
                <input
                  type="datetime-local"
                  id="deadline"
                  name="deadline"
                  value={taskData.deadline}
                  onChange={handleChange}
                  min={currentDate}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="estimatedHours" className="block text-gray-300 mb-1">
                  <FaClock className="inline mr-2" /> Estimated Hours
                </label>
                <input
                  type="number"
                  id="estimatedHours"
                  name="estimatedHours"
                  value={taskData.estimatedHours}
                  onChange={handleChange}
                  min="0.5"
                  max="24"
                  step="0.5"
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-1">
                  <FaStar className="inline mr-2" /> Priority (1-3)
                </label>
                <div className="flex space-x-4">
                  {[1, 2, 3].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRatingChange(rating)}
                      className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                        taskData.rating === rating 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-gray-300 mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {availableIcons.map((iconObj, index) => {
                    const Icon = iconObj.icon;
                    const isSelected = taskData.icon === Icon;
                    
                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleIconSelect(Icon)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg transition-colors ${
                          isSelected 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        <Icon size={20} />
                        <span className="text-xs mt-1">{iconObj.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                >
                  {isEditing ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TaskModal; 