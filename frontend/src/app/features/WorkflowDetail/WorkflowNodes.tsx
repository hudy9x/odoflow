import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  OnNodesChange,
  Node,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useWorkflowStore } from './store';
import { nodeTypes } from '../WorkflowNodes';
import { edgeTypes } from '../WorkflowEdge';
import WorkflowBackground from './WorkflowBackground';

const defaultEdgeStyle = {
  stroke: '#d2d2d2',
  strokeWidth: 4,
  strokeDasharray: '5,5',
}

export default function WorkflowNodes() {
  const { nodes, edges, updateNodes, updateEdges, onConnect } = useWorkflowStore();

  const handleNodesChange: OnNodesChange = useCallback((changes) => {
    updateNodes(changes);
  }, [updateNodes]);

  const handleNodeDrag = useCallback((_: React.MouseEvent, node: Node) => {
    // Update node position in store
    updateNodes([{
      id: node.id,
      type: 'position',
      position: node.position,
    }]);
  }, [updateNodes]);

  console.log('rendr node')

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={handleNodesChange}
        onEdgesChange={updateEdges}
        onConnect={onConnect}
        onNodeDragStop={handleNodeDrag}
        defaultEdgeOptions={{
          type: 'bezier',
          style: defaultEdgeStyle
        }}
        fitView
      >
        {/* <Controls /> */}
        {/* <MiniMap /> */}
        <Background bgColor="#f3f3f4" variant={BackgroundVariant.Cross} gap={12} size={1.5} />
        <WorkflowBackground />
      </ReactFlow>
    </div>
  );
}
