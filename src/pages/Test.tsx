import React from 'react';

const Test: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Earth and Space Background */}
      <div className="fixed inset-0 z-0" style={{
        background: 'radial-gradient(ellipse at center, #0a0a2e 0%, #1a1a3a 25%, #2d1b69 50%, #1a1a3a 75%, #0a0a2e 100%)'
      }}>
        {/* Large Earth in Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-[800px] h-[800px] rounded-full relative overflow-hidden opacity-20 earth-spin" style={{
            background: 'linear-gradient(45deg, #4a90e2 0%, #357abd 25%, #2c5aa0 50%, #1e3a8a 75%, #1e40af 100%)',
            boxShadow: 'inset 0 0 100px rgba(0,0,0,0.5), 0 0 100px rgba(74, 144, 226, 0.2)',
            animationDuration: '60s'
          }}>
            {/* Continents */}
            <div className="absolute inset-0">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path d="M20 30 Q25 25 30 30 Q35 35 30 40 Q25 45 20 40 Q15 35 20 30" fill="#8FBC8F" opacity="0.8" />
                <path d="M25 45 Q30 50 35 55 Q30 60 25 65 Q20 60 25 55 Q20 50 25 45" fill="#8FBC8F" opacity="0.8" />
                <path d="M45 25 Q50 20 55 25 Q50 30 45 25" fill="#8FBC8F" opacity="0.8" />
                <path d="M45 35 Q50 40 55 45 Q50 50 45 55 Q40 50 45 45 Q40 40 45 35" fill="#8FBC8F" opacity="0.8" />
                <path d="M55 25 Q70 20 75 30 Q70 40 65 35 Q60 30 55 25" fill="#8FBC8F" opacity="0.8" />
                <path d="M70 60 Q75 65 80 60 Q75 55 70 60" fill="#8FBC8F" opacity="0.8" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Stars */}
        <div className="absolute inset-0">
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Earth Background Test</h1>
          <p className="text-xl">If you can see this, the Earth background is working!</p>
          <p className="mt-4 text-sm opacity-70">You should see a large blue Earth sphere in the background</p>
        </div>
      </div>
    </div>
  );
};

export default Test;