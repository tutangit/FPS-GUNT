
import React from 'react';

export const Crosshair: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="relative w-6 h-6">
        {/* Top */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-green-400 opacity-80" />
        {/* Bottom */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[2px] h-2 bg-green-400 opacity-80" />
        {/* Left */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] w-2 bg-green-400 opacity-80" />
        {/* Right */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 h-[2px] w-2 bg-green-400 opacity-80" />
        {/* Dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[2px] bg-green-400" />
      </div>
    </div>
  );
};
