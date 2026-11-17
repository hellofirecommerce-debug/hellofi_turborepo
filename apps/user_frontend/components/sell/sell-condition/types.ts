export type RepairStatus = "none" | "authorised" | "unauthorised";

export interface BasicAnswers {
  powersOn?: boolean;
  calls?: boolean;
  screenOriginal?: boolean;
  repair?: RepairStatus;
}

export type ConditionTab = "basics" | "defects" | "accessories";

export interface DefectDetail {
  answer?: "yes" | "no";
  count?: string;
  problem?: string;
}

export interface DefectAnswers {
  display: DefectDetail;
  body: DefectDetail;
  functional: string[];
}

export interface AccessoryAnswers {
  items: string[];
  place?: "india" | "abroad";
  insurance?: string;
  finance?: string;
  age?: string;
  notes: string;
}
