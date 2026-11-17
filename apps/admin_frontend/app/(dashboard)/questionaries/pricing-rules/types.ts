export interface PricingRule {
  id: string;
  conditionId: string;
  ruleName?: string;
  description?: string;
  ruleLogic: string;
  ruleBrandStrategy: string;
  targetConditionId?: string;
  highestScoreType: string;
  highestAction: string;
  targetOptionId?: string;
  condition?: { id: string; title: string };
  triggers?: any[];
}
