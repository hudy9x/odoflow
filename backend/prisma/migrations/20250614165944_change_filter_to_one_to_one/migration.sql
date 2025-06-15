/*
  Warnings:

  - A unique constraint covering the columns `[targetNodeId]` on the table `WorkflowNodeFilter` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "WorkflowNodeFilter" DROP CONSTRAINT "WorkflowNodeFilter_targetNodeId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowNodeFilter_targetNodeId_key" ON "WorkflowNodeFilter"("targetNodeId");

-- AddForeignKey
ALTER TABLE "WorkflowNodeFilter" ADD CONSTRAINT "WorkflowNodeFilter_targetNodeId_fkey" FOREIGN KEY ("targetNodeId") REFERENCES "WorkflowNode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
