import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

interface VideoThumbnailProps {
  src: string;
  title: string;
  aspectRatio?: 'horizontal' | 'vertical';
  isShowreel?: boolean;
  thumbnailIndex?: number;
}

export function VideoThumbnail({
  src,
  title,
  aspectRatio = 'horizontal',
  isShowreel = false
}: VideoThumbnailProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => setIsLoaded(true);
    video.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      video.removeEventListener('canplaythrough', handleCanPlay);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      className={`group relative rounded-xl overflow-hidden bg-black shadow-xl hover:shadow-2xl transition-all duration-300 ${
        isShowreel ? 'aspect-video' : aspectRatio === 'vertical' ? 'aspect-[9/16]' : 'aspect-video'
      }`}
    >
      <video
        ref={videoRef}
        src={src}
        className="w-full h-full object-cover"
        playsInline
        preload="auto"
        loop
        muted
      />

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}

      <div
        onClick={togglePlay}
        className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 cursor-pointer ${
          isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'
        }`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {!isPlaying && (
          <div className="relative z-10 flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full shadow-2xl transform group-hover:scale-110 transition-transform duration-300">
            <Play className="w-8 h-8 md:w-10 md:h-10 text-black ml-1" fill="black" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h4 className="text-white font-bosenAlt text-sm md:text-base tracking-wide">
            {title}
          </h4>
        </div>
      </div>
    </div>
  );
}
