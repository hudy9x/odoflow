import { PrismaClient } from '../../generated/prisma/index.js';
import type { WorkflowNode } from '../../generated/prisma/index.js';
import type { NodeExecutionResult } from './types.js';
import crypto from 'crypto';

export class NodeRunLogger {
  constructor(private prisma: PrismaClient) {}

  generateLogId(): string {
    return crypto.randomUUID();
  }

  async createLog(params: {
    logId: string,
    workflowRunId: string,
    node: WorkflowNode,
    inputData: any
  }): Promise<void> {
    await this.prisma.workflowRunLog.create({
      data: {
        id: params.logId,
        workflowRunId: params.workflowRunId,
        nodeId: params.node.id,
        nodeType: params.node.type,
        nodeName: params.node.name,
        status: 'STARTED',
        inputData: params.inputData || null
      }
    });
  }

  async updateLog(params: {
    logId: string,
    result: NodeExecutionResult
  }): Promise<void> {
    await this.prisma.workflowRunLog.update({
      where: { id: params.logId },
      data: {
        status: params.result.success ? 'COMPLETED' : 'FAILED',
        outputData: params.result.output ? JSON.parse(JSON.stringify(params.result.output)) : null,
        error: params.result.error ? JSON.parse(JSON.stringify(params.result.error)) : null,
        completedAt: new Date(),
        durationMs: Date.now() - new Date().getTime()
      }
    });
  }
}
