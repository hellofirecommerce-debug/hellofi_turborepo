"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoStory } from "./StoriesAndReviewsSection";

interface Props {
  stories: VideoStory[];
}

export const VideoStoryStack: React.FC<Props> = ({ stories = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({});

  useEffect(() => {
    if (stories.length <= 1 || playingIndex !== null) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [stories.length, playingIndex]);

  if (stories.length === 0) {
    return (
      <div className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[340px] xl:h-[360px] mb-8 md:mb-0 rounded-xl bg-gray-100 flex items-center justify-center">
        <p className="text-sm text-gray-400">No stories available</p>
      </div>
    );
  }

  const handlePlayClick = (i: number) => {
    const videoEl = videoRefs.current[i];
    if (!videoEl) return;

    if (playingIndex === i) {
      videoEl.pause();
      setPlayingIndex(null);
    } else {
      videoEl.currentTime = 0;
      videoEl.play();
      setPlayingIndex(i);
    }
  };

  return (
    <div
      className="relative h-[240px] sm:h-[280px] md:h-[320px] lg:h-[340px] xl:h-[360px] mb-8 md:mb-0"
      style={{ perspective: "1000px" }}
    >
      {stories.map((story, i) => {
        const offset = (i - activeIndex + stories.length) % stories.length;
        const isActive = offset === 0;
        const isPlaying = playingIndex === i;

        return (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-xl overflow-hidden bg-gray-800 cursor-pointer"
            onClick={() => handlePlayClick(i)}
            animate={{
              scale: 1 - offset * 0.06,
              y: offset * 18,
              opacity: offset < 3 ? 1 - offset * 0.25 : 0,
              zIndex: stories.length - offset,
            }}
            transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            style={{ pointerEvents: isActive ? "auto" : "none" }}
          >
            <video
              ref={(el) => {
                videoRefs.current[i] = el;
              }}
              src={story.videoUrl}
              poster={story.thumbnailUrl}
              className="absolute inset-0 w-full h-full object-cover cursor-pointer"
              playsInline
              onEnded={() => setPlayingIndex(null)}
            />

            {story.duration && !isPlaying && (
              <span className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">
                {story.duration}
              </span>
            )}

            {!isPlaying && (
              <button
                type="button"
                title="Play video"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlayClick(i);
                }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center z-10 cursor-pointer"
              >
                <Play size={16} className="text-white" />
              </button>
            )}

            {!isPlaying && (
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-medium text-[15px] mb-2">
                  {story.title}
                </p>
                {story.productName && (
                  <div className="flex items-center gap-2 bg-black/40 rounded-md p-1.5">
                    {story.productImage && (
                      <div className="w-6 h-6 rounded bg-gray-600 relative overflow-hidden flex-shrink-0">
                        <Image
                          src={story.productImage}
                          alt={story.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="text-white text-[11px] m-0">
                        {story.productName}
                      </p>
                      {story.price && (
                        <p className="text-white text-xs font-medium m-0">
                          {story.price}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
