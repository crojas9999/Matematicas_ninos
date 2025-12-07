import React from 'react';
import { Cloud, Car, Flag } from 'lucide-react';
import { LEVELS, GOAL_SCORE } from '../types';

interface GameSceneProps {
  level: number;
  progressCount: number; // Current progress (0 to GOAL_SCORE)
}

export const GameScene: React.FC<GameSceneProps> = ({ level, progressCount }) => {
  // Calculate percentage to goal
  const progressPercent = Math.min((progressCount / GOAL_SCORE) * 100, 90); 
  const levelConfig = LEVELS[level as keyof typeof LEVELS] || LEVELS[1];

  return (
    <div className="relative w-full h-48 md:h-56 bg-gradient-to-b from-sky-300 to-sky-100 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white mb-6">
      
      {/* Background Scenery (Mountains/Hills) */}
      <div className="absolute bottom-16 left-0 w-full h-24 bg-emerald-200 rounded-t-[50%] scale-150 translate-y-4 opacity-80"></div>
      <div className="absolute bottom-16 right-0 w-3/4 h-32 bg-emerald-300 rounded-t-[40%] translate-y-8"></div>

      {/* Sun */}
      <div className="absolute top-4 right-10 w-14 h-14 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.6)]"></div>

      {/* Clouds */}
      <div className="absolute top-6 left-10 text-white/90 animate-float" style={{ animationDelay: '0s' }}>
        <Cloud size={48} fill="currentColor" />
      </div>
      <div className="absolute top-10 right-32 text-white/70 animate-float" style={{ animationDelay: '2s' }}>
        <Cloud size={32} fill="currentColor" />
      </div>

      {/* The Road */}
      <div className="absolute bottom-0 w-full h-16 bg-slate-600 border-t-4 border-slate-700">
        {/* Road Markings */}
        <div className="absolute top-1/2 left-0 w-full h-0 border-t-2 border-dashed border-white/50 transform -translate-y-1/2"></div>
      </div>

      {/* Finish Line (Meta) */}
      <div className="absolute bottom-4 right-4 flex flex-col items-center z-0">
         <div className="flex flex-col items-center">
            <div className="bg-black text-white p-1 rounded-sm border border-white transform skew-x-[-10deg]">
                <Flag size={24} fill="white" />
            </div>
            <div className="h-12 w-1 bg-slate-800"></div>
         </div>
         <span className="text-[10px] font-black uppercase text-slate-500 bg-white/80 px-1 rounded mt-[-5px] z-10">Meta</span>
      </div>

      {/* The Car (Character) */}
      <div 
        className="absolute bottom-5 transition-all duration-1000 ease-in-out z-10"
        style={{ left: `${5 + progressPercent * 0.85}%` }} 
      >
        <div className="relative animate-drive">
            <div className={`p-2 rounded-xl shadow-lg border-2 border-white/50 bg-gradient-to-r ${
                level === 1 ? 'from-emerald-500 to-emerald-600' :
                level === 2 ? 'from-amber-500 to-amber-600' :
                'from-rose-500 to-rose-600'
            }`}>
                <Car size={42} className="text-white" strokeWidth={2.5} />
            </div>
            {/* Wind effect */}
            <div className="absolute top-2 -left-4 w-6 h-0.5 bg-white/30 rounded-full"></div>
            <div className="absolute bottom-2 -left-6 w-4 h-0.5 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Level Badge */}
      <div className="absolute top-3 left-3">
        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm bg-white border ${levelConfig.border} ${levelConfig.color}`}>
            Nivel: {levelConfig.label}
        </div>
      </div>

      {/* Progress Text */}
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-slate-600 shadow-sm border border-white">
         {progressCount} / {GOAL_SCORE} para la Meta
      </div>
    </div>
  );
};