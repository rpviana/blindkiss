import { useState, useRef, useEffect } from "react";
import { useListTracks } from "@/api-client";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

export function CassettePlayer() {
  const { data: tracks = [] } = useListTracks();
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const nextTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (tracks.length === 0) return;
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleTrackEnded = () => {
    nextTrack();
  };

  if (!tracks.length) {
    return (
      <div className="border-2 border-border p-6 bg-card text-center font-mono text-muted-foreground">
        [NENHUMA FAIXA CARREGADA]
      </div>
    );
  }

  return (
    <div className="border-4 border-border bg-card p-4 md:p-6 w-full max-w-md mx-auto shadow-[8px_8px_0px_0px_rgba(145,8,2,0.2)]">
      <audio
        ref={audioRef}
        src={currentTrack?.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnded}
      />

      {/* Cassette Visuals */}
      <div className="relative border-2 border-border rounded-lg bg-background p-3 md:p-4 mb-6 flex justify-between items-center overflow-hidden">
        {/* Left Reel */}
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-border rounded-full flex items-center justify-center relative overflow-hidden bg-zinc-800">
           <div className={`absolute inset-2 border-4 border-dashed border-zinc-600 rounded-full ${isPlaying ? "animate-spin-slow" : ""}`} />
           <div className="w-4 h-4 bg-background rounded-full z-10 border-2 border-border" />
        </div>

        {/* Tape window */}
        <div className="flex-1 h-10 md:h-12 border-2 border-border bg-zinc-900 mx-2 relative overflow-hidden flex items-center justify-center">
           <div className="w-full h-1 bg-zinc-700 absolute opacity-50" />
        </div>

        {/* Right Reel */}
        <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-border rounded-full flex items-center justify-center relative overflow-hidden bg-zinc-800">
           <div className={`absolute inset-2 border-4 border-dashed border-zinc-600 rounded-full ${isPlaying ? "animate-spin-slow" : ""}`} />
           <div className="w-4 h-4 bg-background rounded-full z-10 border-2 border-border" />
        </div>
        
        {/* Label */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-white px-2 py-0.5 border-b border-l border-r border-border text-[10px] font-mono font-bold text-black uppercase tracking-wider whitespace-nowrap">
          MIXTAPE BLINDKISS
        </div>
      </div>

      {/* Track Info */}
      <div className="text-center mb-4 min-h-[3.5rem]">
        <h3 className="font-display text-lg md:text-xl text-primary truncate uppercase">
          {currentTrack?.title || "DESCONHECIDO"}
        </h3>
        <p className="font-mono text-xs md:text-sm text-foreground/80 truncate">
          {currentTrack?.artist || "BLINDKISS"}
        </p>
      </div>

      {/* Progress */}
      <div className="h-2 bg-border/20 mb-6 relative border border-border">
        <div
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4 md:gap-6">
        <button
          onClick={prevTrack}
          className="p-2 md:p-3 border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
        >
          <SkipBack size={20} className="md:w-6 md:h-6" />
        </button>
        
        <button
          onClick={togglePlay}
          className="p-3 md:p-4 border-4 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all active:scale-95 rounded-none"
        >
          {isPlaying ? <Pause size={28} className="md:w-8 md:h-8" /> : <Play size={28} className="md:w-8 md:h-8 ml-1" />}
        </button>

        <button
          onClick={nextTrack}
          className="p-2 md:p-3 border-2 border-border hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:scale-95"
        >
          <SkipForward size={20} className="md:w-6 md:h-6" />
        </button>
      </div>
    </div>
  );
}
