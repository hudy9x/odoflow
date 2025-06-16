import { get, post, del, put } from './api.service';

export interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

export interface WorkflowNodeFilter {
  id: string;
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  conditions: FilterCondition[][];
  createdAt: string;
  updatedAt: string;
}

export interface CreateFilterRequest extends Record<string, unknown> {
  workflowId: string;
  sourceNodeId: string;
  targetNodeId: string;
  label?: string;
  conditions: FilterCondition[][];
}

export interface UpdateFilterRequest extends Record<string, unknown> {
  label?: string;
  conditions: FilterCondition[][];
}

const BASE_URL =`/node-filters`;

export const nodeFilterService = {
  /**
   * Create a new filter between nodes
   */
  async createFilter(data: CreateFilterRequest) {
    return post<{ data: WorkflowNodeFilter }>(BASE_URL, data);
  },

  /**
   * Get all filters for a workflow
   */
  async getWorkflowFilters(workflowId: string) {
    return get<{ data: WorkflowNodeFilter[] }>(`${BASE_URL}/workflow/${workflowId}`);
  },

  /**
   * Delete a filter by ID
   */
  async deleteFilter(filterId: string) {
    return del<{ message: string }>(`${BASE_URL}/${filterId}`);
  },

  /**
   * Update a filter by ID
   */
  async updateFilter(filterId: string, data: UpdateFilterRequest) {
    return put<{ data: WorkflowNodeFilter }>(`${BASE_URL}/${filterId}`, data);
  },
};
