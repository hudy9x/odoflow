/*
  Warnings:

  - The values [SCHEDULED] on the enum `TriggerType` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[workflowId,shortId]` on the table `WorkflowNode` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TriggerType_new" AS ENUM ('WEBHOOK', 'REGULAR', 'DAILY');
ALTER TABLE "Workflow" ALTER COLUMN "triggerType" TYPE "TriggerType_new" USING ("triggerType"::text::"TriggerType_new");
ALTER TYPE "TriggerType" RENAME TO "TriggerType_old";
ALTER TYPE "TriggerType_new" RENAME TO "TriggerType";
DROP TYPE "TriggerType_old";
COMMIT;

-- AlterTable
ALTER TABLE "WorkflowNode" ADD COLUMN     "shortId" TEXT;

-- CreateTable
CREATE TABLE "WorkflowNodeFilter" (
    "id" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "sourceNodeId" TEXT NOT NULL,
    "targetNodeId" TEXT NOT NULL,
    "conditions" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkflowNodeFilter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkflowNodeFilter_sourceNodeId_idx" ON "WorkflowNodeFilter"("sourceNodeId");

-- CreateIndex
CREATE INDEX "WorkflowNodeFilter_targetNodeId_idx" ON "WorkflowNodeFilter"("targetNodeId");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowNode_workflowId_shortId_key" ON "WorkflowNode"("workflowId", "shortId");

-- AddForeignKey
ALTER TABLE "WorkflowNodeFilter" ADD CONSTRAINT "WorkflowNodeFilter_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowNodeFilter" ADD CONSTRAINT "WorkflowNodeFilter_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "WorkflowNode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
