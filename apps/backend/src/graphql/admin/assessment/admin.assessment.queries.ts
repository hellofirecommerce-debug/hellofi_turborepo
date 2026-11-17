export const queries = `#graphql
  getAssessments(categoryId: String): AssessmentListResponse!
  getAssessmentById(id: ID!): Assessment!
  getAssessmentByCategory(categoryId: String!): Assessment
  getSteps(assessmentId: String): AssessmentStepListResponse!
  getStepById(id: ID!): AssessmentStep!
`;
