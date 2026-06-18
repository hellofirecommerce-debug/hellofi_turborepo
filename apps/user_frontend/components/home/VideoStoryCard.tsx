"use client";
import React from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { VideoStory } from "./StoriesAndReviewsSection";

interface Props {
  story: VideoStory;
}

export const VideoStoryCard: React.FC<Props> = ({ story }) => {
  return (
    <div className="relative rounded-xl overflow-hidden h-[340px] bg-gray-800">
      <Image
        src={story.thumbnailUrl}
        alt={story.title}
        fill
        className="object-cover opacity-90"
      />
      {story.duration && (
        <span className="absolute top-2.5 left-2.5 bg-black/60 text-white text-[11px] px-2 py-0.5 rounded-md">
          {story.duration}
        </span>
      )}
      <button
        type="button"
        title="Play video"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 border-white flex items-center justify-center"
      >
        <Play size={16} className="text-white" />
      </button>
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
        <p className="text-white font-medium text-[15px] mb-2">{story.title}</p>
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
              <p className="text-white text-[11px] m-0">{story.productName}</p>
              {story.price && (
                <p className="text-white text-xs font-medium m-0">
                  {story.price}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
