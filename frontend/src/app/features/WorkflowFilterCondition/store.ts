import { create } from 'zustand';
import { nodeFilterService, WorkflowNodeFilter, CreateFilterRequest, FilterCondition } from '@/app/services/node.filter.service';
import { toast } from 'sonner';

interface FilterStore {
  filters: WorkflowNodeFilter[];
  isLoading: boolean;
  error: string | null;
  fetchFilters: (workflowId: string) => Promise<void>;
  addFilter: (data: CreateFilterRequest) => Promise<void>;
  updateFilter: (filterId: string, data: { conditions: FilterCondition[][], label?: string }) => Promise<void>;
  deleteFilter: (filterId: string) => Promise<void>;
  findFilterByNodes: (sourceNodeId: string, targetNodeId: string) => WorkflowNodeFilter | null;
}

export const useFilterStore = create<FilterStore>((set, get) => ({
  filters: [],
  isLoading: false,
  error: null,

  fetchFilters: async (workflowId: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await nodeFilterService.getWorkflowFilters(workflowId);
      set({ filters: response.data });
    } catch (err) {
      console.log('useFilterStore.fetchFilters', err)
      set({ error: 'Failed to fetch filters' });
    } finally {
      toast.success('Filters fetched successfully')
      set({ isLoading: false });
    }
  },

  addFilter: async (data: CreateFilterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await nodeFilterService.createFilter(data);
      set((state) => ({
        filters: [...state.filters, response.data]
      }));
      toast.success('Filter added successfully')
    } catch (error) {
      toast.error('Failed to add filter')
      set({ error: 'Failed to add filter' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFilter: async (filterId: string, data: { conditions: FilterCondition[][], label?: string }) => {
    set({ isLoading: true, error: null });
    try {
      console.log('updateFilter', filterId, data)
      const response = await nodeFilterService.updateFilter(filterId, data);
      set((state) => ({
        filters: state.filters.map(filter => 
          filter.id === filterId ? response.data : filter
        )
      }));
      toast.success('Filter updated successfully')
    } catch (error) {
      toast.error('Failed to update filter')
      set({ error: 'Failed to update filter' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  findFilterByNodes: (sourceNodeId: string, targetNodeId: string) => {
    const state = get();
    return state.filters.find(filter => 
      filter.sourceNodeId === sourceNodeId && 
      filter.targetNodeId === targetNodeId
    ) || null;
  },

  deleteFilter: async (filterId: string) => {
    set({ isLoading: true, error: null });
    try {
      await nodeFilterService.deleteFilter(filterId);
      set((state) => ({
        filters: state.filters.filter(filter => filter.id !== filterId)
      }));
      toast.success('Filter deleted successfully')
    } catch (error) {
      toast.error('Failed to delete filter')
      set({ error: 'Failed to delete filter' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));
