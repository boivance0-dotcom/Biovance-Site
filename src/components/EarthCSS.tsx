import React from 'react';
import { motion } from 'framer-motion';

interface EarthCSSProps {
  className?: string;
  style?: React.CSSProperties;
}

const EarthCSS: React.FC<EarthCSSProps> = ({ className = '', style = {} }) => {
  return (
    <div 
      className={`relative w-full h-full min-h-[400px] flex items-center justify-center ${className}`}
      style={style}
    >
      {/* Earth Container */}
      <div className="relative">
        {/* Main Earth Sphere */}
        <motion.div
          className="w-64 h-64 rounded-full relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          style={{
            background: 'linear-gradient(45deg, #4a90e2 0%, #357abd 25%, #2c5aa0 50%, #1e3a8a 75%, #1e40af 100%)',
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 50px rgba(74, 144, 226, 0.3)'
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Continents */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* North America */}
              <path
                d="M20 30 Q25 25 30 30 Q35 35 30 40 Q25 45 20 40 Q15 35 20 30"
                fill="#8FBC8F"
                opacity="0.8"
              />
              {/* South America */}
              <path
                d="M25 45 Q30 50 35 55 Q30 60 25 65 Q20 60 25 55 Q20 50 25 45"
                fill="#8FBC8F"
                opacity="0.8"
              />
              {/* Europe */}
              <path
                d="M45 25 Q50 20 55 25 Q50 30 45 25"
                fill="#8FBC8F"
                opacity="0.8"
              />
              {/* Africa */}
              <path
                d="M45 35 Q50 40 55 45 Q50 50 45 55 Q40 50 45 45 Q40 40 45 35"
                fill="#8FBC8F"
                opacity="0.8"
              />
              {/* Asia */}
              <path
                d="M55 25 Q70 20 75 30 Q70 40 65 35 Q60 30 55 25"
                fill="#8FBC8F"
                opacity="0.8"
              />
              {/* Australia */}
              <path
                d="M70 60 Q75 65 80 60 Q75 55 70 60"
                fill="#8FBC8F"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Cloud Layer */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            }}
            animate={{ 
              x: [0, 10, 0],
              y: [0, -5, 0]
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Atmosphere Glow */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400/20 via-transparent to-blue-400/20" />
        </motion.div>

        {/* Orbital Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-white/20"
          style={{ margin: '-10px' }}
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        />

        {/* Stars Background */}
        <div className="absolute inset-0 -z-10">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Overlay Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white/80">
          <div className="text-sm font-medium tracking-wider uppercase">
            Explore Our Planet
          </div>
        </div>
      </div>

      {/* Interactive Hover Effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default EarthCSS;