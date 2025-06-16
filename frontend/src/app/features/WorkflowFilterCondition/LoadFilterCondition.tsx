import { FC, useEffect, memo } from 'react';
import { useFilterStore } from './store';

interface LoadFilterConditionProps {
  workflowId?: string;
}

const LoadFilterCondition: FC<LoadFilterConditionProps> = ({ workflowId }) => {
  const { fetchFilters } = useFilterStore();

  useEffect(() => {
    if (workflowId) {
      fetchFilters(workflowId);
    }
  }, [workflowId, fetchFilters]);

  return null
};

export default memo(LoadFilterCondition)