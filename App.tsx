import React, { useState } from 'react';
import { 
  Heart, 
  Star, 
  Trophy, 
  RefreshCcw, 
  Play, 
  CheckCircle2, 
  XCircle,
  Home,
  BrainCircuit,
  PartyPopper,
  Medal
} from 'lucide-react';
import { GameScene } from './components/GameScene';
import { generateProblem } from './utils/mathEngine';
import { GameState, OperationType, LEVELS, GOAL_SCORE } from './types';

const INITIAL_LIVES = 3;

const App: React.FC = () => {
  // Initialize with Level 1 (Easy) selected by default
  const [state, setState] = useState<GameState>({
    score: 0,
    level: 1, 
    lives: INITIAL_LIVES,
    streak: 0,
    progress: 0,
    isPlaying: false,
    isGameOver: false,
    isVictory: false,
    selectedOperations: ['+'],
    currentProblem: null,
    lastAnswerCorrect: null,
  });

  const [feedbackMsg, setFeedbackMsg] = useState<string>("");

  const goHome = () => {
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: false,
      isVictory: false,
      score: 0,
      lives: INITIAL_LIVES,
      streak: 0,
      progress: 0,
      lastAnswerCorrect: null
    }));
  };

  const startGame = () => {
    if (state.selectedOperations.length === 0) return;

    setState(prev => {
      const firstProblem = generateProblem(prev.level, prev.selectedOperations);
      return {
        ...prev,
        score: 0,
        lives: INITIAL_LIVES,
        streak: 0,
        progress: 0,
        isPlaying: true,
        isGameOver: false,
        isVictory: false,
        currentProblem: firstProblem,
        lastAnswerCorrect: null,
      };
    });
    setFeedbackMsg("");
  };

  const handleAnswer = (selectedOption: number) => {
    if (!state.currentProblem || state.lastAnswerCorrect !== null) return;

    const isCorrect = selectedOption === state.currentProblem.answer;

    if (isCorrect) {
      setFeedbackMsg("¡Correcto!");
      setState(prev => ({
        ...prev,
        score: prev.score + (10 * prev.level) + (prev.streak * 2),
        streak: prev.streak + 1,
        progress: prev.progress + 1,
        lastAnswerCorrect: true,
      }));
    } else {
      setFeedbackMsg(`¡Oh no! Era ${state.currentProblem.answer}`);
      setState(prev => ({
        ...prev,
        lives: prev.lives - 1,
        streak: 0,
        lastAnswerCorrect: false,
      }));
    }

    setTimeout(() => {
      setState(prev => {
        // Check for Game Over
        if (prev.lives <= 0 && !isCorrect) {
          return { ...prev, isGameOver: true, isPlaying: false, lastAnswerCorrect: null };
        }
        
        // Check for Victory (Reached Goal)
        if (isCorrect && prev.progress >= GOAL_SCORE) {
           return { ...prev, isVictory: true, isPlaying: false, lastAnswerCorrect: null };
        }

        // Continue Game
        return {
          ...prev,
          currentProblem: generateProblem(prev.level, prev.selectedOperations),
          lastAnswerCorrect: null
        };
      });
      setFeedbackMsg("");
    }, 1200);
  };

  const toggleOperation = (op: OperationType) => {
    setState(prev => {
      const currentOps = prev.selectedOperations;
      let newOps: OperationType[];
      if (currentOps.includes(op)) {
        if (currentOps.length === 1) return prev; 
        newOps = currentOps.filter(o => o !== op);
      } else {
        newOps = [...currentOps, op];
      }
      return { ...prev, selectedOperations: newOps };
    });
  };

  const setDifficulty = (lvl: number) => {
    setState(prev => ({ ...prev, level: lvl }));
  };

  const getOperationColor = (op: OperationType) => {
    switch(op) {
      case '+': return 'bg-emerald-500 shadow-emerald-200';
      case '-': return 'bg-blue-500 shadow-blue-200';
      case '×': return 'bg-violet-500 shadow-violet-200';
      case '÷': return 'bg-rose-500 shadow-rose-200';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`min-h-screen font-sans text-slate-800 flex justify-center transition-colors duration-1000 ${state.isVictory ? 'party-bg' : 'bg-slate-50'}`}>
      
      {/* Background Blobs (Only show if not victory to avoid clash with party bg) */}
      {!state.isVictory && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-white"></div>
           <div className="absolute top-20 right-0 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-200/40 rounded-full blur-3xl"></div>
        </div>
      )}

      {/* Confetti Overlay for Victory */}
      {state.isVictory && (
        <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
           <div className="absolute top-10 left-1/4 text-yellow-300 animate-bounce delay-100 opacity-50"><Star size={40} fill="currentColor"/></div>
           <div className="absolute bottom-20 right-1/4 text-white animate-bounce delay-300 opacity-50"><Star size={60} fill="currentColor"/></div>
           <div className="absolute top-1/2 left-10 text-pink-300 animate-pulse delay-75 opacity-50"><Heart size={50} fill="currentColor"/></div>
           <div className="absolute top-20 right-10 text-cyan-300 animate-pulse delay-500 opacity-50"><Star size={30} fill="currentColor"/></div>
        </div>
      )}

      <div className="relative z-10 w-full max-w-lg px-5 py-6 h-screen flex flex-col">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white">
             <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
               <Trophy size={20} />
             </div>
             <div>
               <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Puntaje</p>
               <p className="text-xl font-black text-slate-800 leading-none">{state.score}</p>
             </div>
          </div>
          
          <div className="flex gap-3">
             {/* Home Button */}
             {(state.isPlaying || state.isVictory) && (
                <button 
                  onClick={goHome}
                  className="bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white text-slate-400 hover:text-indigo-600 hover:bg-white transition-all active:scale-95"
                  title="Volver al Inicio"
                >
                  <Home size={24} />
                </button>
             )}
             
             {!state.isPlaying && !state.isGameOver && !state.isVictory && (
               <div className="bg-white/70 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white text-indigo-600">
                  <BrainCircuit size={24} />
               </div>
             )}

             <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm border border-white flex flex-col items-center min-w-[80px]">
                <span className="text-[10px] font-bold text-rose-400 mb-1 uppercase tracking-wider">Vidas</span>
                <div className="flex gap-1">
                  {[...Array(INITIAL_LIVES)].map((_, i) => (
                    <Heart 
                      key={i} 
                      size={18} 
                      className={`${i < state.lives ? 'fill-rose-500 text-rose-500 drop-shadow-sm' : 'text-slate-200'} transition-all`} 
                    />
                  ))}
                </div>
             </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col relative">
          
          <GameScene level={state.level} progressCount={state.progress} />

          <div className="flex-grow relative flex flex-col">
             
             {/* --- START MENU --- */}
             {!state.isPlaying && !state.isGameOver && !state.isVictory && (
               <div className="flex-grow flex flex-col gap-6 animate-pop">
                 
                 <div className="text-center mb-2">
                    <h1 className="text-4xl font-black text-slate-800 mb-1 tracking-tight">Math Race</h1>
                    <p className="text-slate-500 text-sm font-medium">¡Llega a la meta respondiendo correctamente!</p>
                 </div>

                 {/* Operations */}
                 <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white">
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">Operaciones</p>
                    <div className="flex justify-center gap-3">
                      {(['+', '-', '×', '÷'] as OperationType[]).map(op => (
                        <button
                          key={op}
                          onClick={() => toggleOperation(op)}
                          className={`w-14 h-14 rounded-2xl text-2xl font-black flex items-center justify-center transition-all transform hover:-translate-y-1 ${
                            state.selectedOperations.includes(op) 
                            ? getOperationColor(op) + ' text-white shadow-lg ring-2 ring-white ring-offset-2 ring-offset-indigo-50' 
                            : 'bg-white border-2 border-slate-100 text-slate-300 hover:border-indigo-200 hover:text-indigo-300'
                          }`}
                        >
                          {op}
                        </button>
                      ))}
                    </div>
                 </div>

                 {/* Difficulty */}
                 <div className="bg-white/60 backdrop-blur-md rounded-3xl p-5 shadow-sm border border-white flex-grow">
                    <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-widest text-center">Nivel de Dificultad</p>
                    <div className="grid grid-cols-1 gap-3">
                       {Object.entries(LEVELS).map(([key, config]) => {
                         const lvlNum = Number(key);
                         const isSelected = state.level === lvlNum;
                         return (
                           <button
                             key={key}
                             onClick={() => setDifficulty(lvlNum)}
                             className={`relative overflow-hidden rounded-2xl p-4 transition-all duration-300 text-left border-2 ${
                               isSelected 
                               ? `${config.bg} ${config.border} ring-1 ring-offset-2 ring-offset-white ring-${config.color.split('-')[1]}-300`
                               : 'bg-white border-slate-100 hover:border-slate-200'
                             }`}
                           >
                             <div className="flex justify-between items-center relative z-10">
                               <span className={`font-black text-lg ${isSelected ? config.color : 'text-slate-400'}`}>
                                 {config.label}
                               </span>
                               {isSelected && <CheckCircle2 size={24} className={config.color} />}
                             </div>
                             {isSelected && <div className={`absolute right-0 bottom-0 opacity-10 ${config.color} transform translate-x-4 translate-y-4`}>
                                <Trophy size={64} fill="currentColor" />
                             </div>}
                           </button>
                         )
                       })}
                    </div>
                 </div>

                 <button 
                  onClick={startGame}
                  className="w-full bg-slate-900 text-white font-bold py-5 rounded-3xl text-xl shadow-xl hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-2"
                 >
                   <Play fill="currentColor" size={24} /> 
                   <span>¡Arrancar Motores!</span>
                 </button>
               </div>
             )}

             {/* --- VICTORY SCREEN (PARTY!) --- */}
             {state.isVictory && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-3xl z-30 animate-pop p-6 border-4 border-white/50 shadow-2xl">
                  
                  <div className="mb-6 relative animate-bounce">
                     <div className="absolute inset-0 bg-yellow-300 blur-3xl opacity-50"></div>
                     <PartyPopper size={100} className="text-purple-600 relative z-10 drop-shadow-lg" />
                  </div>

                  <h2 className="text-5xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] mb-2 text-center bg-clip-text">
                    ¡FELICITACIONES!
                  </h2>
                  <p className="text-white font-bold text-xl mb-8 drop-shadow-md text-center">
                    ¡Llegaste a la meta!
                  </p>

                  <div className="bg-white/90 p-6 rounded-3xl w-full mb-8 flex flex-col items-center shadow-xl transform rotate-1">
                    <span className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Puntaje Total</span>
                    <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {state.score}
                    </span>
                    <div className="flex gap-1 mt-2">
                       <Star size={24} className="text-yellow-400 fill-yellow-400" />
                       <Star size={24} className="text-yellow-400 fill-yellow-400" />
                       <Star size={24} className="text-yellow-400 fill-yellow-400" />
                    </div>
                  </div>

                  <div className="flex flex-col w-full gap-3">
                     <button 
                      onClick={startGame}
                      className="w-full bg-white text-indigo-600 font-black py-4 rounded-2xl text-xl shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                     >
                       <RefreshCcw size={24} /> ¡Jugar Otra Vez!
                     </button>
                     
                     <button 
                      onClick={goHome}
                      className="w-full bg-white/20 text-white font-bold py-4 rounded-2xl text-lg border-2 border-white/40 hover:bg-white/30 transition-all flex items-center justify-center gap-2"
                     >
                       <Home size={20} /> Volver al Inicio
                     </button>
                  </div>
               </div>
             )}

             {/* --- GAME OVER --- */}
             {state.isGameOver && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-xl rounded-3xl z-20 animate-pop p-6">
                 <div className="mb-6 relative">
                    <XCircle size={80} className="text-rose-400 relative z-10 drop-shadow-md" />
                 </div>
                 
                 <h2 className="text-4xl font-black text-slate-800 mb-2">¡Se acabó la gasolina!</h2>
                 
                 <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl w-full mb-8 flex flex-col items-center shadow-inner">
                    <span className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Puntaje Final</span>
                    <span className="text-5xl font-black text-indigo-600 tracking-tight">{state.score}</span>
                 </div>

                 <div className="flex flex-col w-full gap-3">
                   <button 
                    onClick={startGame}
                    className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                   >
                     <RefreshCcw size={20} /> Intentar de Nuevo
                   </button>
                   <button 
                    onClick={goHome}
                    className="w-full bg-white text-slate-500 font-bold py-4 rounded-2xl text-lg border-2 border-slate-100 hover:bg-slate-50 transition-all"
                   >
                     Volver al Menú
                   </button>
                 </div>
               </div>
             )}

             {/* --- GAMEPLAY --- */}
             {state.isPlaying && state.currentProblem && (
               <div className="flex flex-col h-full animate-pop">
                 <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 p-6 flex-grow flex flex-col justify-center items-center relative overflow-hidden border border-slate-100">
                    
                    {/* Feedback Overlay */}
                    {state.lastAnswerCorrect !== null && (
                      <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                        state.lastAnswerCorrect ? 'bg-emerald-50/90' : 'bg-rose-50/90'
                      }`}>
                         <div className={`p-4 rounded-full mb-4 ${state.lastAnswerCorrect ? 'bg-emerald-100' : 'bg-rose-100'}`}>
                           {state.lastAnswerCorrect ? (
                             <CheckCircle2 size={48} className="text-emerald-500 animate-pop" />
                           ) : (
                             <XCircle size={48} className="text-rose-500 animate-pop" />
                           )}
                         </div>
                         <h3 className={`text-2xl font-black text-center ${state.lastAnswerCorrect ? 'text-emerald-700' : 'text-rose-700'}`}>
                           {feedbackMsg}
                         </h3>
                      </div>
                    )}

                    <div className="w-full flex-grow flex flex-col justify-center items-center mb-6">
                        <span className="bg-slate-100 text-slate-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-10">Resuelve</span>
                        
                        {/* Improved Number Display */}
                        <div className="flex items-center justify-center gap-3 md:gap-6 mb-4">
                           {/* Number 1 Block */}
                           <div className="w-24 h-28 md:w-32 md:h-36 bg-white rounded-3xl border-b-[6px] border-r-4 border-indigo-200 shadow-lg flex items-center justify-center text-6xl md:text-7xl font-black text-indigo-500 transform -rotate-2 hover:scale-105 transition-transform">
                              {state.currentProblem.num1}
                           </div>

                           {/* Operator */}
                           <div className="text-4xl md:text-5xl font-black text-slate-300">
                              {state.currentProblem.operation}
                           </div>

                           {/* Number 2 Block */}
                           <div className="w-24 h-28 md:w-32 md:h-36 bg-white rounded-3xl border-b-[6px] border-r-4 border-purple-200 shadow-lg flex items-center justify-center text-6xl md:text-7xl font-black text-purple-500 transform rotate-2 hover:scale-105 transition-transform">
                              {state.currentProblem.num2}
                           </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                      {state.currentProblem.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAnswer(option)}
                          disabled={state.lastAnswerCorrect !== null}
                          className="bg-slate-50 hover:bg-white text-slate-700 hover:text-indigo-600 text-3xl font-black py-8 rounded-2xl border-b-4 border-slate-200 hover:border-indigo-200 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 disabled:transform-none shadow-sm"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                 </div>
               </div>
             )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;