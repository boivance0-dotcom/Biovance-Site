import React from 'react';

const EarthBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 bg-red-500">
      {/* Test - Simple visible background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #1a1a3a 25%, #2d1b69 50%, #1a1a3a 75%, #0a0a2e 100%)'
        }}
      />
      
      {/* Simple Earth for testing */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-64 h-64 rounded-full bg-blue-500 opacity-50"></div>
      </div>

      {/* Simple stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="absolute w-2 h-2 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default EarthBackground;