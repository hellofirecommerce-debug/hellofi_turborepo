export const isStepComplete = (step: any, answers: Record<string, string[]>) =>
  !step ||
  step.conditions.every(
    (c: any) => !c.isRequired || (answers[c.id] || []).length > 0,
  );
