import { VideoStory } from "../../components/home/StoriesAndReviewsSection";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8000/graphql";

const GET_VIDEO_REVIEWS_QUERY = `
  query GetVideoReviews($type: VideoReviewType) {
    getVideoReviews(type: $type) {
      id
      title
      videoUrl
      thumbnailUrl
      type
      priority
      isActive
    }
  }
`;

interface VideoReviewRaw {
  id: string;
  title: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  type: string;
  priority: number;
  isActive: boolean;
}

export async function fetchHomeVideoStories(): Promise<VideoStory[]> {
  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: GET_VIDEO_REVIEWS_QUERY,
        variables: { type: "HOME" },
      }),
      next: { revalidate: 300 },
    });

    console.log("VIDEO REVIEWS STATUS:", res.status);
    const json = await res.json();
    console.log("VIDEO REVIEWS RESPONSE:", JSON.stringify(json, null, 2));

    const reviews: VideoReviewRaw[] = json?.data?.getVideoReviews ?? [];
    console.log("REVIEWS FOUND:", reviews.length);

    return reviews
      .filter((r) => r.isActive)
      .sort((a, b) => a.priority - b.priority)
      .map((r) => ({
        videoUrl: `${CDN_URL}/${r.videoUrl}`,
        thumbnailUrl: `${CDN_URL}/${r.thumbnailUrl}`,
        title: r.title ?? "",
      }));
  } catch (error) {
    console.error("Failed to fetch home video stories:", error);
    return [];
  }
}
