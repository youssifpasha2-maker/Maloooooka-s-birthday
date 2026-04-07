/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { Sparkles, Heart, Stars, Volume2, VolumeX, Music } from "lucide-react";

// --- Components ---

const Balloon = ({ color, delay, x, onPop }: { color: string; delay: number; x: string; onPop: () => void }) => {
  const [isPopped, setIsPopped] = useState(false);

  if (isPopped) return null;

  return (
    <motion.div
      initial={{ y: "110vh", opacity: 0 }}
      animate={{ 
        y: "-20vh", 
        opacity: [0, 1, 1, 0],
        x: ["0%", "10%", "-10%", "5%"] 
      }}
      transition={{ 
        duration: 15 + Math.random() * 10, 
        delay, 
        repeat: Infinity,
        ease: "linear"
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 1.5, opacity: 0 }}
      onClick={() => {
        setIsPopped(true);
        onPop();
        setTimeout(() => setIsPopped(false), 2000); // Respawn after 2s
      }}
      className="absolute cursor-pointer z-30"
      style={{ left: x }}
    >
      <div 
        className="w-16 h-20 rounded-full relative"
        style={{ 
          background: `radial-gradient(circle at 30% 30%, #fff 0%, ${color} 100%)`,
          boxShadow: `0 10px 20px rgba(0,0,0,0.2)`
        }}
      >
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-inherit clip-triangle" />
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-white/30" />
      </div>
    </motion.div>
  );
};

interface TouchBurstProps {
  x: number;
  y: number;
  onComplete: () => void;
  key?: React.Key;
}

const TouchBurst = ({ x, y, onComplete }: TouchBurstProps) => {
  return (
    <div className="absolute pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
          animate={{ 
            scale: [0, 1.5, 0],
            x: Math.cos(i * 30 * (Math.PI / 180)) * 100,
            y: Math.sin(i * 30 * (Math.PI / 180)) * 100,
            opacity: 0
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          onAnimationComplete={i === 0 ? onComplete : undefined}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: ["#b76e79", "#f4c2c2", "#d4af37"][i % 3] }}
        />
      ))}
    </div>
  );
};

const Candle = ({ x, isLit, onToggle }: { x: string; isLit: boolean; onToggle: () => void }) => (
  <div 
    className="absolute -top-8 w-1.5 h-8 bg-pink-200 rounded-full cursor-pointer z-40" 
    style={{ left: x }}
    onClick={(e) => {
      e.stopPropagation();
      onToggle();
    }}
  >
    <AnimatePresence>
      {isLit && (
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-3 h-5 candle-flame rounded-full" 
        />
      )}
    </AnimatePresence>
  </div>
);

const Cake = () => {
  const [litCandles, setLitCandles] = useState([true, true, true]);

  const toggleCandle = (index: number) => {
    const newLit = [...litCandles];
    newLit[index] = !newLit[index];
    setLitCandles(newLit);
  };

  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="relative z-10 flex flex-col items-center"
    >
      {/* Top Layer */}
      <div className="w-32 h-16 bg-white rounded-t-lg shadow-xl relative border-b-2 border-rose-gold/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-gold/10" />
        <div className="flex justify-around px-2 pt-1">
          <div className="w-4 h-4 rounded-full bg-rose-gold" />
          <div className="w-4 h-4 rounded-full bg-rose-gold" />
          <div className="w-4 h-4 rounded-full bg-rose-gold" />
        </div>
        <Candle x="20%" isLit={litCandles[0]} onToggle={() => toggleCandle(0)} />
        <Candle x="50%" isLit={litCandles[1]} onToggle={() => toggleCandle(1)} />
        <Candle x="80%" isLit={litCandles[2]} onToggle={() => toggleCandle(2)} />
      </div>
      {/* Middle Layer */}
      <div className="w-48 h-20 bg-white rounded-t-lg -mt-1 shadow-2xl relative border-b-2 border-rose-gold/20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-gold/10" />
        <div className="flex justify-around px-4 pt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full bg-soft-pink" />
          ))}
        </div>
      </div>
      {/* Bottom Layer */}
      <div className="w-64 h-24 bg-white rounded-t-lg -mt-1 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-rose-gold/10" />
        <div className="flex justify-around px-6 pt-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="w-6 h-6 rounded-full bg-rose-gold" />
          ))}
        </div>
      </div>
      {/* Plate */}
      <div className="w-80 h-4 bg-gold/30 rounded-full -mt-1 backdrop-blur-sm border border-gold/20" />
    </motion.div>
  );
};

const FairyLight = ({ x, y, delay }: { x: string; y: string; delay: number }) => (
  <motion.div
    initial={{ opacity: 0.3, scale: 0.8 }}
    animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 2 + Math.random() * 2, delay, repeat: Infinity }}
    className="absolute w-1.5 h-1.5 rounded-full bg-yellow-100 shadow-[0_0_10px_#fff]"
    style={{ left: x, top: y }}
  />
);

const Confetti = () => {
  const pieces = useMemo(() => Array.from({ length: 50 }), []);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: "-5%", 
            left: `${Math.random() * 100}%`, 
            rotate: 0,
            scale: Math.random() * 0.5 + 0.5
          }}
          animate={{ 
            top: "105%", 
            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
            x: [0, Math.random() * 100 - 50]
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            delay: Math.random() * 10, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute w-2 h-2 rounded-sm"
          style={{ 
            backgroundColor: ["#b76e79", "#f4c2c2", "#d4af37", "#fff"][Math.floor(Math.random() * 4)] 
          }}
        />
      ))}
    </div>
  );
};

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [bursts, setBursts] = useState<{ id: number; x: number; y: number }[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(err => console.log("Audio play failed:", err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleScreenClick = (e: any) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    const y = e.touches ? e.touches[0].clientY : e.clientY;
    
    const id = Math.random() + Date.now();
    setBursts(prev => [...prev, { id, x, y }]);
  };

  const removeBurst = (id: number) => {
    setBursts(prev => prev.filter(b => b.id !== id));
  };

  const balloons = useMemo(() => [
    { color: "#b76e79", x: "10%", delay: 0 },
    { color: "#f4c2c2", x: "25%", delay: 2 },
    { color: "#d4af37", x: "40%", delay: 4 },
    { color: "#b76e79", x: "60%", delay: 1 },
    { color: "#f4c2c2", x: "75%", delay: 3 },
    { color: "#d4af37", x: "90%", delay: 5 },
  ], []);

  const lights = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    delay: Math.random() * 5
  })), []);

  return (
    <div 
      className="relative w-full h-screen overflow-hidden bg-[#0a0502] flex flex-col items-center justify-center touch-none"
      onClick={handleScreenClick}
    >
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#3a1510_0%,_transparent_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#b76e7933_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#f4c2c222_0%,_transparent_50%)]" />

      {/* Fairy Lights */}
      {lights.map((light, i) => (
        <FairyLight key={i} {...light} />
      ))}

      {/* Balloons */}
      {balloons.map((balloon, i) => (
        <Balloon 
          key={i} 
          {...balloon} 
          onPop={() => {
            // Balloon pop logic handled inside component
          }} 
        />
      ))}

      {/* Confetti */}
      <Confetti />

      {/* Touch Bursts */}
      <AnimatePresence>
        {bursts.map(burst => (
          <TouchBurst 
            key={burst.id} 
            x={burst.x} 
            y={burst.y} 
            onComplete={() => removeBurst(burst.id)} 
          />
        ))}
      </AnimatePresence>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="happy birthday.mp3"
        loop
      />

      {/* Music Toggle Button */}
      <motion.button
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleMusic}
        className="absolute top-6 right-6 z-50 glass-card p-4 rounded-full text-rose-gold hover:text-white transition-colors flex items-center gap-2"
      >
        {isPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
        <span className="font-serif italic text-sm hidden md:block">
          {isPlaying ? "Playing Music" : "Play Music"}
        </span>
      </motion.button>

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center gap-12">
        {/* Neon Sign */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-center"
        >
          <h1 className="font-calligraphy text-6xl md:text-8xl text-white neon-glow tracking-wider mb-4">
            Happy Birthday
          </h1>
          <motion.h2 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="font-calligraphy text-7xl md:text-9xl text-rose-gold neon-glow"
          >
            Malooooka
          </motion.h2>
        </motion.div>

        {/* Cake Section */}
        <div className="relative">
          <Cake />
          {/* Decorative elements around cake */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-20 border border-rose-gold/10 rounded-full border-dashed"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-32 border border-soft-pink/5 rounded-full border-dashed"
          />
        </div>

        {/* Floating Icons */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ y: [0, -20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute top-1/4 left-1/4"
          >
            <Sparkles className="text-gold w-8 h-8" />
          </motion.div>
          <motion.div
            animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute top-1/3 right-1/4"
          >
            <Heart className="text-rose-gold w-6 h-6" />
          </motion.div>
          <motion.div
            animate={{ y: [0, -15, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, delay: 2 }}
            className="absolute bottom-1/4 left-1/3"
          >
            <Stars className="text-soft-pink w-10 h-10" />
          </motion.div>
        </div>
      </div>

      {/* Bottom Message Overlay */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 glass-card px-8 py-4 rounded-full"
      >
        <p className="font-serif italic text-rose-gold/80 text-lg tracking-widest">
          Wishing you a magical day filled with love and joy
        </p>
      </motion.div>

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]" />
    </div>
  );
}
