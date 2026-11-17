export interface Option {
  id: string;
  conditionId: string;
  label: string;
  action: string;
  score: number;
  scoreType: string;
  priority: number;
  isRedirect: boolean;
  redirectTo?: string;
  condition?: {
    id: string;
    title: string;
    step?: {
      id: string;
      stepName: string;
      assessment?: { id: string; name: string };
    };
  };
  // 👇 CHANGE TO PLURAL ARRAY
  popupConditions?: {
    id: string;
    title: string;
  }[];
}
