export interface Assessment {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  totalSteps: number;
  isActive: boolean;
  category?: { id: string; name: string };
  steps?: any[];
}

export interface AssessmentFilter {
  categoryId?: string;
  page?: number;
  pageSize?: number;
}
