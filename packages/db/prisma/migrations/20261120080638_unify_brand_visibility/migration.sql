-- AlterTable
ALTER TABLE "assessment_steps" ADD COLUMN     "brandVisibilityStrategy" "BrandVisibilityStrategy" NOT NULL DEFAULT 'ALL';

-- AlterTable
ALTER TABLE "brand_visibilities" ADD COLUMN     "optionId" TEXT,
ADD COLUMN     "stepId" TEXT,
ALTER COLUMN "conditionId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "selling_options" ADD COLUMN     "brandVisibilityStrategy" "BrandVisibilityStrategy" NOT NULL DEFAULT 'ALL';

-- CreateIndex
CREATE INDEX "brand_visibilities_stepId_idx" ON "brand_visibilities"("stepId");

-- CreateIndex
CREATE INDEX "brand_visibilities_optionId_idx" ON "brand_visibilities"("optionId");

-- AddForeignKey
ALTER TABLE "brand_visibilities" ADD CONSTRAINT "brand_visibilities_stepId_fkey" FOREIGN KEY ("stepId") REFERENCES "assessment_steps"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brand_visibilities" ADD CONSTRAINT "brand_visibilities_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "selling_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
