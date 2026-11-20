export interface Step {
  id: string;
  assessmentId: string;
  stepCategory: string;
  stepNumber: number;
  stepName: string;
  title?: string;
  subtitle?: string;
  description?: string;
  priority: number;
  brandVisibilityStrategy?: string;
  brandVisibility?: { id?: string; brandId?: string; brandName?: string }[];
  assessment?: { id: string; name: string };
}
