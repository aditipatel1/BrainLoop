"use client";

import React from 'react';
import { IconType } from 'react-icons';
import { motion } from 'framer-motion';

interface IconWrapperProps {
  Icon: IconType;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  isAnimated?: boolean;
  hasPulse?: boolean;
  hasGlow?: boolean;
  onClick?: () => void;
  className?: string;
}

const IconWrapper: React.FC<IconWrapperProps> = ({
  Icon,
  size = 'md',
  color,
  isAnimated = false,
  hasPulse = false,
  hasGlow = false,
  onClick,
  className = '',
}) => {
  // Define consistent sizes
  const sizeMap = {
    sm: 20,
    md: 24,
    lg: 32,
    xl: 40,
  };

  // Compute style based on props
  const iconStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  // Add glow effect if specified
  if (hasGlow) {
    iconStyle.filter = `drop-shadow(0 0 6px ${color || 'rgba(137, 90, 255, 0.8)'})`;
  }

  // Create wrapper content based on animation preference
  const renderIcon = () => (
    <div className={`icon-wrapper ${className}`} style={iconStyle} onClick={onClick}>
      <Icon size={sizeMap[size]} />
    </div>
  );

  // If animation is enabled, wrap in motion.div
  if (isAnimated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={
          hasPulse
            ? {
                scale: [1, 1.05, 1],
              }
            : undefined
        }
        transition={
          hasPulse
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : undefined
        }
      >
        {renderIcon()}
      </motion.div>
    );
  }

  return renderIcon();
};

export default IconWrapper; 