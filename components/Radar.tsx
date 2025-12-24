
import React from 'react';
import { Vector3 } from '../types';

interface RadarProps {
  playerPosition: Vector3;
  playerRotation: number;
}

export const Radar: React.FC<RadarProps> = ({ playerPosition, playerRotation }) => {
  const radarSize = 120;
  const mapRange = 500; // Match the physics bounds

  // Normalize position to radar coordinates
  const radarX = ((playerPosition.x + mapRange) / (mapRange * 2)) * radarSize;
  const radarY = ((playerPosition.z + mapRange) / (mapRange * 2)) * radarSize;

  return (
    <div className="fixed top-4 left-4 border-2 border-green-500/40 bg-black/60 w-[120px] h-[120px] rounded-sm overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-[1px] bg-green-500/10" />
        <div className="h-full w-[1px] bg-green-500/10" />
      </div>
      
      {/* Player Icon */}
      <div 
        className="absolute w-2 h-2 bg-green-400 rounded-full"
        style={{
          left: `${radarX}px`,
          top: `${radarY}px`,
          transform: `translate(-50%, -50%) rotate(${-playerRotation}rad)`,
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }}
      />

      {/* Static "Sites" representation */}
      <div className="absolute text-[8px] text-green-500 font-bold" style={{ left: '20px', top: '20px' }}>A</div>
      <div className="absolute text-[8px] text-green-500 font-bold" style={{ right: '20px', bottom: '20px' }}>B</div>
    </div>
  );
};
