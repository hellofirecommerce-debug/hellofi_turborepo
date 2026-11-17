export const mutations = `#graphql
  createAssessment(input: CreateAssessmentInput!): Assessment!
  updateAssessment(input: UpdateAssessmentInput!): Assessment!
  deleteAssessment(id: ID!): DeleteResponse!

  createAssessmentStep(input: CreateAssessmentStepInput!): AssessmentStep!
  updateAssessmentStep(input: UpdateAssessmentStepInput!): AssessmentStep!
  deleteAssessmentStep(id: ID!): DeleteResponse!
`;
