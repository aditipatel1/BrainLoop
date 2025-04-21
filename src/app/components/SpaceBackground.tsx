"use client";

import React, { useEffect, useRef } from 'react';
import styles from './SpaceBackground.module.css';

interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

const SpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);

  // Generate stars with varying properties
  const generateStars = (count: number, width: number, height: number): Star[] => {
    const stars: Star[] = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 0.5,
        opacity: Math.random() * 0.7 + 0.3,
        speed: Math.random() * 0.05 + 0.01,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2,
      });
    }
    return stars;
  };

  // Handle canvas resize
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Regenerate stars for the new dimensions
    starsRef.current = generateStars(350, canvas.width, canvas.height);
  };

  // Render stars on canvas
  const renderStars = (time: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with a very dark blue gradient for space
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#020106');
    gradient.addColorStop(1, '#010104');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars with twinkling effect
    starsRef.current.forEach(star => {
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase) * 0.5 + 0.5;
      const finalOpacity = star.opacity * (0.5 + twinkle * 0.5);
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      
      // Create a radial gradient for each star to give it a glow
      const gradient = ctx.createRadialGradient(
        star.x, star.y, 0,
        star.x, star.y, star.size * 2
      );
      gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`);
      gradient.addColorStop(0.6, `rgba(210, 230, 255, ${finalOpacity * 0.5})`);
      gradient.addColorStop(1, 'rgba(200, 220, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Move stars slightly (parallax effect)
      star.y += star.speed;
      
      // Reset star position when it goes off screen
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });
    
    // Continue animation loop
    animationFrameRef.current = requestAnimationFrame(renderStars);
  };

  useEffect(() => {
    // Initialize canvas and start animation
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameRef.current = requestAnimationFrame(renderStars);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div className={styles.spaceContainer}>
      <canvas ref={canvasRef} className={styles.spaceCanvas}></canvas>
      <div className={styles.foregroundElements}>
        <div className={styles.distantPlanet1}></div>
        <div className={styles.distantPlanet2}></div>
        <div className={styles.shootingStar}></div>
      </div>
    </div>
  );
};

export default SpaceBackground; 