"use client";

import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';
import styles from './IconStyles.module.css';

type IconColor = 'purple' | 'blue' | 'green' | 'orange' | string;
type IconSize = 'sm' | 'md' | 'lg' | 'xl';
type IconBackground = 'none' | 'purple' | 'blue' | 'green';
type IconEffect = 'none' | 'pulse' | 'float' | 'glow' | 'rotate';

interface EnhancedIconProps {
  Icon: IconType;
  size?: IconSize;
  color?: IconColor;
  background?: IconBackground;
  isAnimated?: boolean;
  effect?: IconEffect;
  onClick?: () => void;
  className?: string;
  label?: string;
  iconSize?: number; // Optional override for icon size
}

const EnhancedIcon: React.FC<EnhancedIconProps> = ({
  Icon,
  size = 'md',
  color = 'white',
  background = 'none',
  isAnimated = false,
  effect = 'none',
  onClick,
  className = '',
  label,
  iconSize,
}) => {
  // Get the CSS classes based on props
  const getContainerClasses = () => {
    const classes = [styles.iconContainer];
    
    // Add size class
    classes.push(styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`]);
    
    // Add background class if needed
    if (background === 'purple') classes.push(styles.withBackground);
    if (background === 'blue') classes.push(styles.withBlueBackground);
    if (background === 'green') classes.push(styles.withGreenBackground);
    
    // Add animation class
    if (effect === 'pulse') classes.push(styles.pulseAnimation);
    if (effect === 'float') classes.push(styles.floatAnimation);
    if (effect === 'glow') classes.push(styles.glowAnimation);
    if (effect === 'rotate') classes.push(styles.rotateAnimation);
    
    // Add glow effect based on color
    if (color === 'purple') classes.push(styles.purpleGlow);
    if (color === 'blue') classes.push(styles.blueGlow);
    if (color === 'green') classes.push(styles.greenGlow);
    if (color === 'orange') classes.push(styles.orangeGlow);
    
    // Add custom class if provided
    if (className) classes.push(className);
    
    return classes.join(' ');
  };
  
  // Get icon size based on container size
  const getIconSize = () => {
    if (iconSize) return iconSize;
    
    // Updated sizes based on container size - reduced for better proportions
    const sizeMap = {
      sm: 16,
      md: 20,
      lg: 26,
      xl: 32,
    };
    
    return sizeMap[size];
  };
  
  // Define the icon color based on props
  const getIconColor = () => {
    // Map color names to color values
    const colorMap: Record<string, string> = {
      purple: '#b388ff',
      blue: '#64b5f6',
      green: '#69f0ae',
      orange: '#ffb74d',
      white: '#ffffff',
    };
    
    return colorMap[color] || color;
  };
  
  // Base icon render function
  const renderIcon = () => (
    <div className={`${styles.iconWrapper} ${getContainerClasses()}`} onClick={onClick}>
      <Icon size={getIconSize()} color={getIconColor()} />
      {label && <span className={styles.iconLabel}>{label}</span>}
    </div>
  );

  // If animated with framer motion
  if (isAnimated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {renderIcon()}
      </motion.div>
    );
  }

  return renderIcon();
};

export default EnhancedIcon; 