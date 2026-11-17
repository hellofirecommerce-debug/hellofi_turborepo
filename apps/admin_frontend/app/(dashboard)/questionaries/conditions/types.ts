// apps/admin_frontend/app/(dashboard)/questionaries/conditions/types.ts
export interface Condition {
  id: string;
  stepId: string;
  parentOptionId?: string | null;
  conditionType: string;
  title: string;
  subtitle?: string;
  description?: string;
  priority: number;
  brandVisibilityStrategy: string;
  image?: string | null;
  icon?: string | null; // optional lucide icon name
  isRequired?: boolean; // customer cannot skip when true
  step?: {
    id: string;
    stepName: string;
    assessment?: { id: string; name: string };
  };
  options?: any[];
}
