-- CreateEnum
CREATE TYPE "StepCategory" AS ENUM ('DEVICE_OVERALL_CONDITION', 'DEVICE_DEFECTS', 'COSMETIC_CONDITION', 'ACCESSORIES', 'LAPTOP_SYSTEM_CONFIG', 'PRICING', 'BASICS', 'SPECIFICATION');

-- CreateEnum
CREATE TYPE "ConditionType" AS ENUM ('BOOLEAN', 'RADIO', 'MULTI_SELECT', 'DROPDOWN');

-- CreateEnum
CREATE TYPE "OptionAction" AS ENUM ('INCREMENT', 'DECREMENT', 'REDIRECT', 'NONE');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('PER', 'RUPPEE', 'MUL');

-- CreateEnum
CREATE TYPE "RuleLogic" AS ENUM ('SKIP_ALL_OPTIONS', 'APPLY_ONLY_SPECIFIC_OPTIONS', 'SKIP_SELF', 'APPLY_HIGHEST_PERCENTAGE');

-- CreateEnum
CREATE TYPE "RedirectTarget" AS ENUM ('NEXT_STEP', 'QUOTE_PAGE', 'SPECIFIC_STEP');

-- CreateEnum
CREATE TYPE "BrandVisibilityStrategy" AS ENUM ('INCLUDE', 'EXCLUDE', 'ALL');

-- CreateTable
CREATE TABLE "assessments" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "totalSteps" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_steps" (
    "id" TEXT NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "stepCategory" "StepCategory" NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "finalStepTitle" TEXT,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "defaultNextStepId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_step_brand_skips" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,

    CONSTRAINT "assessment_step_brand_skips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_step_dependencies" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "dependsOnStepId" TEXT,
    "conditionId" TEXT,
    "optionId" TEXT,
    "redirectTo" "RedirectTarget" NOT NULL DEFAULT 'NEXT_STEP',
    "specificStepId" TEXT,

    CONSTRAINT "assessment_step_dependencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selling_conditions" (
    "id" TEXT NOT NULL,
    "stepId" TEXT NOT NULL,
    "conditionType" "ConditionType" NOT NULL DEFAULT 'RADIO',
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "finalConditionName" TEXT,
    "image" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "applicableFromDate" TIMESTAMP(3),
    "brandVisibilityStrategy" "BrandVisibilityStrategy" NOT NULL DEFAULT 'ALL',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brand_visibilities" (
    "id" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "strategy" "BrandVisibilityStrategy" NOT NULL DEFAULT 'ALL',
    "brandId" TEXT,
    "brandName" TEXT,

    CONSTRAINT "brand_visibilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selling_options" (
    "id" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "action" "OptionAction" NOT NULL DEFAULT 'NONE',
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreType" "ScoreType" NOT NULL DEFAULT 'PER',
    "isRedirect" BOOLEAN NOT NULL DEFAULT false,
    "redirectTo" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT,
    "description" TEXT,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "selling_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_conditions" (
    "id" TEXT NOT NULL,
    "parentConditionId" TEXT NOT NULL,
    "parentOptionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "conditionType" "ConditionType" NOT NULL DEFAULT 'RADIO',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_options" (
    "id" TEXT NOT NULL,
    "subConditionId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "scoreType" "ScoreType" NOT NULL DEFAULT 'PER',
    "action" "OptionAction" NOT NULL DEFAULT 'NONE',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_brand_scores" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "brandName" TEXT,
    "score" INTEGER NOT NULL,
    "scoreType" "ScoreType" NOT NULL,
    "action" "OptionAction" NOT NULL,

    CONSTRAINT "option_brand_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_series_scores" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    "seriesName" TEXT,
    "score" INTEGER NOT NULL,
    "scoreType" "ScoreType" NOT NULL,
    "action" "OptionAction" NOT NULL,

    CONSTRAINT "option_series_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option_product_scores" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "productName" TEXT,
    "score" INTEGER NOT NULL,
    "scoreType" "ScoreType" NOT NULL,
    "action" "OptionAction" NOT NULL,

    CONSTRAINT "option_product_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condition_rules" (
    "id" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "ruleName" TEXT,
    "description" TEXT,
    "ruleLogic" "RuleLogic" NOT NULL,
    "ruleBrandStrategy" "BrandVisibilityStrategy" NOT NULL DEFAULT 'ALL',
    "targetConditionId" TEXT,
    "highestScoreType" "ScoreType" NOT NULL DEFAULT 'PER',
    "highestAction" "OptionAction" NOT NULL DEFAULT 'DECREMENT',
    "targetOptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "condition_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condition_rule_triggers" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "conditionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "logic" TEXT NOT NULL DEFAULT 'OR',

    CONSTRAINT "condition_rule_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condition_rule_brands" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "brandId" TEXT,
    "brandName" TEXT,

    CONSTRAINT "condition_rule_brands_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "assessments_categoryId_idx" ON "assessments"("categoryId");

-- CreateIndex
CREATE INDEX "assessment_steps_assessmentId_idx" ON "assessment_steps"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_steps_assessmentId_stepNumber_key" ON "assessment_steps"("assessmentId", "stepNumber");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_step_brand_skips_stepId_brandId_key" ON "assessment_step_brand_skips"("stepId", "brandId");

-- CreateIndex
CREATE INDEX "selling_conditions_stepId_idx" ON "selling_conditions"("stepId");

-- CreateIndex
CREATE INDEX "brand_visibilities_conditionId_idx" ON "brand_visibilities"("conditionId");

-- CreateIndex
CREATE INDEX "selling_options_conditionId_idx" ON "selling_options"("conditionId");

-- CreateIndex
CREATE INDEX "sub_conditions_parentConditionId_idx" ON "sub_conditions"("parentConditionId");

-- CreateIndex
CREATE INDEX "sub_conditions_parentOptionId_idx" ON "sub_conditions"("parentOptionId");

-- CreateIndex
CREATE INDEX "sub_options_subConditionId_idx" ON "sub_options"("subConditionId");

-- CreateIndex
CREATE UNIQUE INDEX "option_brand_scores_optionId_brandId_key" ON "option_brand_scores"("optionId", "brandId");

-- CreateIndex
CREATE UNIQUE INDEX "option_series_scores_optionId_seriesId_key" ON "option_series_scores"("optionId", "seriesId");

-- CreateIndex
CREATE UNIQUE INDEX "option_product_scores_optionId_productId_key" ON "option_product_scores"("optionId", "productId");

-- CreateIndex
CREATE INDEX "condition_rules_conditionId_idx" ON "condition_rules"("conditionId");

-- CreateIndex
CREATE INDEX "condition_rule_triggers_ruleId_idx" ON "condition_rule_triggers"("ruleId");

-- CreateIndex
CREATE INDEX "condition_rule_brands_ruleId_idx" ON "condition_rule_brands"("ruleId");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_steps" ADD CONSTRAINT "assessment_steps_defaultNextStepId_fkey" FOREIGN KEY ("defaultNextStepId") REFERENCES "assessment_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_steps" ADD CONSTRAINT "assessment_steps_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_step_brand_skips" ADD CONSTRAINT "assessment_step_brand_skips_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "assessment_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_step_dependencies" ADD CONSTRAINT "assessment_step_dependencies_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "assessment_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_step_dependencies" ADD CONSTRAINT "assessment_step_dependencies_dependsOnStepId_fkey" FOREIGN KEY ("dependsOnStepId") REFERENCES "assessment_steps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_step_dependencies" ADD CONSTRAINT "assessment_step_dependencies_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "selling_conditions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_step_dependencies" ADD CONSTRAINT "assessment_step_dependencies_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_conditions" ADD CONSTRAINT "selling_conditions_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "assessment_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_visibilities" ADD CONSTRAINT "brand_visibilities_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "selling_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selling_options" ADD CONSTRAINT "selling_options_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "selling_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_conditions" ADD CONSTRAINT "sub_conditions_parentConditionId_fkey" FOREIGN KEY ("parentConditionId") REFERENCES "selling_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_conditions" ADD CONSTRAINT "sub_conditions_parentOptionId_fkey" FOREIGN KEY ("parentOptionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sub_options" ADD CONSTRAINT "sub_options_subConditionId_fkey" FOREIGN KEY ("subConditionId") REFERENCES "sub_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_brand_scores" ADD CONSTRAINT "option_brand_scores_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_series_scores" ADD CONSTRAINT "option_series_scores_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "option_product_scores" ADD CONSTRAINT "option_product_scores_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rules" ADD CONSTRAINT "condition_rules_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "selling_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rules" ADD CONSTRAINT "condition_rules_targetConditionId_fkey" FOREIGN KEY ("targetConditionId") REFERENCES "selling_conditions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rules" ADD CONSTRAINT "condition_rules_targetOptionId_fkey" FOREIGN KEY ("targetOptionId") REFERENCES "selling_options"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rule_triggers" ADD CONSTRAINT "condition_rule_triggers_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "condition_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rule_triggers" ADD CONSTRAINT "condition_rule_triggers_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "selling_conditions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rule_triggers" ADD CONSTRAINT "condition_rule_triggers_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condition_rule_brands" ADD CONSTRAINT "condition_rule_brands_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "condition_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
