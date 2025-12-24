
import React from 'react';
import { WEAPONS } from '../constants';
import { Weapon } from '../types';

interface BuyMenuProps {
  money: number;
  onBuy: (weapon: Weapon) => void;
  onClose: () => void;
}

export const BuyMenu: React.FC<BuyMenuProps> = ({ money, onBuy, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border-2 border-green-500 p-6 w-[400px]">
        <h2 className="text-2xl font-bold text-green-500 mb-6 uppercase tracking-wider">Select Equipment</h2>
        
        <div className="space-y-4">
          {Object.values(WEAPONS).map((w) => (
            <button
              key={w.id}
              disabled={money < w.price}
              onClick={() => onBuy(w)}
              className={`w-full text-left p-4 border transition-all ${
                money >= w.price 
                ? 'border-green-500 hover:bg-green-500/20 text-green-400' 
                : 'border-red-900/40 text-red-900 cursor-not-allowed opacity-50'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-bold">{w.name}</span>
                <span className="font-mono text-sm">${w.price}</span>
              </div>
            </button>
          ))}
        </div>

        <button 
          onClick={onClose}
          className="mt-8 w-full py-2 bg-green-600 text-black font-bold uppercase hover:bg-green-500 transition-colors"
        >
          Exit Menu
        </button>
      </div>
    </div>
  );
};
