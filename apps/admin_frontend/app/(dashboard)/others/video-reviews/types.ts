export interface VideoReview {
  id: string;
  title?: string | null;
  videoUrl: string;
  thumbnailUrl: string;
  type: "BUY" | "SELL" | "HOME";
  priority: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
