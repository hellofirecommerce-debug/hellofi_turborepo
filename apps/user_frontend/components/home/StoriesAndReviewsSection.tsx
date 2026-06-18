"use client";
import React from "react";
import { VideoStoryStack } from "./VideoStoryStack";
import { BlogCardColumn } from "./BlogCardColumn";
import { ReviewColumn } from "./ReviewColumn";

export interface VideoStory {
  videoUrl: string;
  thumbnailUrl: string;
  title: string;
  productName?: string;
  productImage?: string;
  price?: string;
  duration?: string;
}

interface Props {
  stories: VideoStory[];
}

export const StoriesAndReviewsSection: React.FC<Props> = ({ stories }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-12 lg:py-14 xl:py-16">
      <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-3xl xl:text-3xl font-semibold mb-4 sm:mb-5 md:mb-6 lg:mb-7 xl:mb-8">
        Stories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr_1fr] lg:grid-cols-[260px_1fr_1fr] xl:grid-cols-[280px_1fr_1fr] gap-8 md:gap-5 lg:gap-6 xl:gap-6 items-start">
        <VideoStoryStack stories={stories} />
        <BlogCardColumn />
        <ReviewColumn />
      </div>
    </section>
  );
};
