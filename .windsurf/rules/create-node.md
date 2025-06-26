---
trigger: manual
---

WORKFLOW NODE CREATION GUIDE

1. FILE STRUCTURE
- Create new folder in frontend/src/app/features/WorkflowNodes/[NodeName]
- Required files:
  - index.tsx (main node component)
  - types.ts (type definitions)
  - [NodeName]ConfigForm.tsx (config form wrapper)
  - [NodeName]ConfigFormContent.tsx (actual form content)

2. REGISTER NODE
- Add node config in WorkflowNodes/index.tsx nodeTypeConfig:
  type: 'your-node-type'
  title: 'Your Node Title'
  description: 'Brief description'
  icon: <IconComponent className="w-4 h-4" />

- Export node in WorkflowNodes/index.tsx nodeTypes:
  your-node-type: YourNodeComponent

- Import node at top of WorkflowNodes/index.tsx:
  import { YourNodeComponent } from './YourNode'

3. NODE IMPLEMENTATION
- types.ts:
  interface NodeConfig {
    // your config properties
  }

  interface NodeData {
    config?: NodeConfig;
    shortId?: string;
  }

  interface NodeProps {
    id: string;
    data: NodeData;
  }

- index.tsx:
  export const YourNode = memo(({ id, data }: NodeProps) => {
    return (
      <NodeBase
        id={id}
        title="Your Node"
        description="Node description"
        icon={<YourIcon className="w-8 h-8" />}
        color="#HexColor"
        type="your-node-type"
        badgeNumber={1}
        shortId={data.shortId}
        popoverContent={<YourNodeConfigForm nodeId={id} />}
        popoverTitle="Configure Your Node"
      />
    );
  });

- [NodeName]ConfigForm.tsx:
  export function YourNodeConfigForm({ nodeId }) {
    const [isLoading, setIsLoading] = useState(true);
    const [config, setConfig] = useState<YourNodeConfig>();

    useEffect(() => {
      async function loadNodeConfig() {
        try {
          const response = await getNodeConfig(nodeId);
          if (response.success) {
            setConfig(response.config.config);
          }
        } catch (error) {
          console.error('Error:', error);
        } finally {
          setIsLoading(false);
        }
      }
      loadNodeConfig();
    }, [nodeId]);

    if (isLoading) return <Loader2 className="h-6 w-6 animate-spin" />;

    return <YourNodeConfigFormContent nodeId={nodeId} initialConfig={config} />;
  }

- [NodeName]ConfigFormContent.tsx:
  export function YourNodeConfigFormContent({ nodeId, initialConfig }) {
    // Form state management
    // Form fields using shadcn components
    // Save function using updateNodeConfig
    return (
      <div className="space-y-4">
        {/* Your form fields */}
        <Button onClick={handleSave}>Save Configuration</Button>
      </div>
    );
  }

4. IMPORTANT NOTES
- Use PascalCase for component names
- All API calls must go through services
- Follow existing node patterns for consistency
- Use shadcn/ui components for forms
- Handle loading states and errors appropriately