import React from 'react';

interface AnimatedGradientProps {
  className?: string;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ className = '' }) => {
  return (
    <div className={`animated-gradient pointer-events-none absolute inset-0 ${className}`} aria-hidden />
  );
};

export default AnimatedGradient;