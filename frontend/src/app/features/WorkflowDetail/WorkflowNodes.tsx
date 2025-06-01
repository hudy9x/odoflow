import React, { useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { NodeCreate, NodeWebhook, NodeHttp, NodeDiscord } from '../WorkflowNodes/CustomNodes';

// Define node types for React Flow
const nodeTypes = {
  create: NodeCreate,
  webhook: NodeWebhook,
  http: NodeHttp,
  discord: NodeDiscord,
};

// Initial node is just a create node
const initialNodes: Node[] = [
  {
    id: 'create-1',
    type: 'create',
    position: { x: 250, y: 200 },
    data: {},
  },
  {
    id: 'create-2',
    type: 'webhook',
    position: { x: 550, y: 200 },
    data: {},
  },
  {
    id: 'create-3',
    type: 'http',
    position: { x: 650, y: 200 },
    data: {},
  },
  {
    id: 'create-4',
    type: 'discord',
    position: { x: 750, y: 200 },
    data: {},
  },
];

const initialEdges: Edge[] = [];

export default function WorkflowNodes() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-[calc(100vh-4rem)]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        {/* <MiniMap /> */}
        <Background color='#c3c3c3' variant={BackgroundVariant.Cross} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
