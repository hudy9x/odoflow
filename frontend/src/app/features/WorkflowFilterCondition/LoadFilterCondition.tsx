import { FC, useEffect } from 'react';
import { useFilterStore } from './store';

interface LoadFilterConditionProps {
  workflowId?: string;
}

export const LoadFilterCondition: FC<LoadFilterConditionProps> = ({ workflowId }) => {
  const { fetchFilters } = useFilterStore();

  useEffect(() => {
    if (workflowId) {
      fetchFilters(workflowId);
    }
  }, [workflowId, fetchFilters]);

  return null
};
