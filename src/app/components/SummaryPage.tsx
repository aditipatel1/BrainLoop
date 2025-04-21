"use client";

import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import {
  FaTasks,
  FaBan,
  FaArrowLeft,
  FaRedo,
  FaGamepad,
  FaClipboardCheck,
} from "react-icons/fa";
import { useAppContext } from "../context/AppContext";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text } from "@react-three/drei";

const SelectedItem: React.FC<{
  name: string;
  index: number;
  type: "goal" | "distraction" | "task";
  description?: string;
  deadline?: string;
  estimatedHours?: number;
}> = ({ name, index, type, description, deadline, estimatedHours }) => {
  const controls = useAnimation();

  useEffect(() => {
    controls.start({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 * index, duration: 0.5 },
    });
  }, [controls, index]);

  const getBgColor = () => {
    switch (type) {
      case "goal":
        return "bg-blue-500";
      case "distraction":
        return "bg-purple-500";
      case "task":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "goal":
        return <FaTasks />;
      case "distraction":
        return <FaBan />;
      case "task":
        return <FaClipboardCheck />;
      default:
        return null;
    }
  };

  // Format deadline for display
  const formattedDeadline = deadline 
    ? new Date(deadline).toLocaleString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) 
    : null;

  return (
    <motion.div
      className="selected-item"
      initial={{
        opacity: 0,
        x: type === "goal" ? -50 : type === "distraction" ? 50 : 0,
        y: type === "task" ? 50 : 0,
      }}
      animate={controls}
      whileHover={{
        scale: 1.02,
        boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
      }}
    >
      <div className={`mr-3 p-2 rounded-full ${getBgColor()}`}>{getIcon()}</div>
      <div className="flex-1">
        <span className="font-medium">{name}</span>
        
        {description && (
          <p className="text-xs text-gray-300 mt-1 truncate max-w-[200px]">
            {description}
          </p>
        )}
        
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          {formattedDeadline && <span>Due: {formattedDeadline}</span>}
          {estimatedHours && <span className="ml-2">{estimatedHours}h</span>}
        </div>
      </div>
    </motion.div>
  );
};

const FloatingText = () => {
  const { viewport } = useThree();
  const ref = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.2;
      ref.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={ref} position={[0, 0, 0]}>
        <Text
          fontSize={0.5}
          font="/fonts/Inter-Bold.woff"
          color="#7928ca"
          anchorX="center"
          anchorY="middle"
        >
          DOABLE
        </Text>
      </group>
    </Float>
  );
};

const SummaryPage: React.FC = () => {
  const { goals, distractions, tasks, setCurrentPage } = useAppContext();

  const handleBack = () => {
    setCurrentPage(2);
  };

  const handleReset = () => {
    setCurrentPage(0);
  };

  const handleStartGame = () => {
    setCurrentPage(4); 
  };

  return (
    <motion.div
      className="page-container"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      <div className="relative max-w-5xl mx-auto px-4 py-8 h-full">
        <div className="absolute inset-0 -z-10">
          <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 10]} intensity={1} />
            <directionalLight position={[-10, -10, -10]} intensity={0.1} />
            <FloatingText />
          </Canvas>
        </div>

        <div className="h-full flex flex-col">
          <motion.div
            className="mb-6 text-center"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="pixel-title mb-2">Your Productivity Plan</h1>
            <p className="pixel-subtitle">Ready to boost your productivity</p>
          </motion.div>

          <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 gap-6 justify-center mx-auto w-full max-w-3xl">
            <motion.div
              className="card p-6 mx-auto w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 112, 243, 0.3)",
              }}
            >
              <div className="flex items-center mb-4 justify-center">
                <div className="bg-blue-500 p-2 rounded-full mr-3">
                  <FaTasks size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">Your Goals</h2>
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                {goals.length > 0 ? (
                  goals.map((goal, index) => (
                    <SelectedItem
                      key={goal.id}
                      name={goal.name}
                      index={index}
                      type="goal"
                      description={goal.description}
                      deadline={goal.deadline}
                      estimatedHours={goal.estimatedHours}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center">No goals selected</p>
                )}
              </div>
            </motion.div>

            <motion.div
              className="card p-6 mx-auto w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{
                y: -5,
                boxShadow:
                  "0 15px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(121, 40, 202, 0.3)",
              }}
            >
              <div className="flex items-center mb-4 justify-center">
                <div className="bg-purple-500 p-2 rounded-full mr-3">
                  <FaBan size={20} />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Distractions to Avoid
                </h2>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {distractions.length > 0 ? (
                  distractions.map((distraction, index) => (
                    <SelectedItem
                      key={distraction.id}
                      name={distraction.name}
                      index={index}
                      type="distraction"
                      description={distraction.description}
                    />
                  ))
                ) : (
                  <p className="text-gray-400 italic text-center">
                    No distractions selected
                  </p>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-8 flex justify-between"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.button
              className="flex items-center px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
              onClick={handleBack}
              whileHover={{ y: -2, boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)" }}
            >
              <FaArrowLeft className="mr-2" /> Back
            </motion.button>

            <div className="flex space-x-4">
              <motion.button
                className="flex items-center px-6 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                onClick={handleReset}
                whileHover={{
                  y: -2,
                  boxShadow: "0 5px 15px rgba(0, 0, 0, 0.2)",
                }}
              >
                <FaRedo className="mr-2" /> Reset
              </motion.button>

              <motion.button
                className="flex items-center px-8 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-colors cursor-pointer"
                onClick={handleStartGame}
                whileHover={{
                  y: -3,
                  boxShadow:
                    "0 10px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(88, 80, 236, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                <FaGamepad className="mr-2" size={20} /> Start Journey
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryPage;