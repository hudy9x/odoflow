import { PrismaClient } from '../../generated/prisma/index.js';
import type { WorkflowNode } from '../../generated/prisma/index.js';
import type { NodeExecutionResult } from './types.js';
import crypto from 'crypto';
import { RedisService } from '../../services/redis.service.js';

const redisService = RedisService.getInstance();

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
    redisService.publish('node-run-log', {
      workflowRunId: params.workflowRunId,
      nodeId: params.node.id,
      status: 'STARTED',
      timestamp: Date.now()
    });
  }

  async updateLog(params: {
    logId: string,
    result: NodeExecutionResult
  }): Promise<void> {
    const log = await this.prisma.workflowRunLog.findUnique({ where: { id: params.logId } });
    this.prisma.workflowRunLog.update({
      where: { id: params.logId },
      data: {
        status: params.result.success ? 'COMPLETED' : 'FAILED',
        outputData: params.result.output ? JSON.parse(JSON.stringify(params.result.output)) : null,
        error: params.result.error ? JSON.parse(JSON.stringify(params.result.error)) : null,
        completedAt: new Date(),
        durationMs: Date.now() - new Date().getTime()
      }
    });
    if (log) {
      redisService.publish('node-run-log', {
        workflowRunId: log.workflowRunId,
        nodeId: log.nodeId,
        status: params.result.success ? 'COMPLETED' : 'FAILED',
        outputData: params.result.output ? JSON.parse(JSON.stringify(params.result.output)) : null,
        timestamp: Date.now()
      });
    }
  }
}
